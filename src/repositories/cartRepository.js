import { CartDTO } from "../dto/cartDTO.js";
import { TicketDTO } from "../dto/ticketDTO.js";

class cartRepository {
  constructor(cartDAO, productDAO, ticketDAO) {
    this.cartDAO = cartDAO;
    this.productDAO = productDAO;
    this.ticketDAO = ticketDAO;
  }

  async getProductsFromCartByID(cid) {
    const cart = await this.cartDAO.getProductsFromCartByID(cid);
    return CartDTO.fromModel(cart);
  }

  async createCart() {
    const cart = await this.cartDAO.createCart();
    return CartDTO.fromModel(cart);
  }

  async addProductByID(cid, pid) {
    const cart = await this.cartDAO.addProductByID(cid, pid);
    return CartDTO.fromModel(cart);
  }

  async deleteProductByID(cid, pid) {
    const cart = await this.cartDAO.deleteProductByID(cid, pid);
    return CartDTO.fromModel(cart);
  }

  async updateAllProducts(cid, products) {
    const cart = await this.cartDAO.updateAllProducts(cid, products);
    return CartDTO.fromModel(cart);
  }

  async updateProductByID(cid, pid, quantity) {
    const cart = await this.cartDAO.updateProductByID(cid, pid, quantity);
    return CartDTO.fromModel(cart);
  }

  async deleteAllProducts(cid) {
    const cart = await this.cartDAO.deleteAllProducts(cid);
    return CartDTO.fromModel(cart);
  }

  async purchase(cid, purchaserEmail) {
    const cart = await this.cartDAO.getProductsFromCartByID(cid);
    const notProcessedProducts = [];
    let amount = 0;

    for (const item of cart.products) {
      const productId = item.product._id.toString();
      const product = await this.productDAO.getProductByID(productId);

      if (product.stock >= item.quantity) {
        await this.productDAO.updateProduct(productId, {
          stock: product.stock - item.quantity
        });
        amount += product.price * item.quantity;
      } else {
        notProcessedProducts.push(productId);
      }
    }

    const remainingProducts = cart.products
      .filter((item) => notProcessedProducts.includes(item.product._id.toString()))
      .map((item) => ({
        product: item.product._id.toString(),
        quantity: item.quantity
      }));

    await this.cartDAO.updateAllProducts(cid, remainingProducts);

    if (amount === 0) {
      return {
        ticket: null,
        notProcessedProducts
      };
    }

    const ticket = await this.ticketDAO.createTicket({
      code: `T-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      amount,
      purchaser: purchaserEmail
    });

    return {
      ticket: TicketDTO.fromModel(ticket),
      notProcessedProducts
    };
  }
}

export { cartRepository };
