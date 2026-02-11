class CartDTO {
  static fromModel(cart) {
    return {
      id: cart._id.toString(),
      products: cart.products.map((item) => {
        const product = item.product?._id ? item.product : null;
        const productId = product ? product._id.toString() : item.product.toString();
        const price = product?.price ?? null;

        return {
          product: productId,
          title: product?.title ?? null,
          price,
          quantity: item.quantity,
          subtotal: price === null ? null : price * item.quantity
        };
      })
    };
  }
}

export { CartDTO };
