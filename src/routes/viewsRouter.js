import { Router } from 'express';
import { productDBManager } from '../dao/productDBManager.js';
import { cartDBManager } from '../dao/cartDBManager.js';

const router = Router();
const ProductService = new productDBManager();
const CartService = new cartDBManager(ProductService);

// 🏠 HOME → muestra productos
router.get('/', async (req, res) => {
    const products = await ProductService.getAllProducts(req.query);

    res.render('index', {
        title: 'Productos',
        style: 'index.css',
        products: JSON.parse(JSON.stringify(products.docs)),
        prevLink: {
            exist: !!products.prevLink,
            link: products.prevLink
        },
        nextLink: {
            exist: !!products.nextLink,
            link: products.nextLink
        }
    });
});

// (opcional) /products sigue funcionando
router.get('/products', async (req, res) => {
    const products = await ProductService.getAllProducts(req.query);

    res.render('index', {
        title: 'Productos',
        style: 'index.css',
        products: JSON.parse(JSON.stringify(products.docs)),
        prevLink: {
            exist: !!products.prevLink,
            link: products.prevLink
        },
        nextLink: {
            exist: !!products.nextLink,
            link: products.nextLink
        }
    });
});

// 🔴 realtime
router.get('/realtimeproducts', async (req, res) => {
    const products = await ProductService.getAllProducts(req.query);

    res.render('realTimeProducts', {
        title: 'Productos en tiempo real',
        style: 'index.css',
        products: JSON.parse(JSON.stringify(products.docs))
    });
});

// 🛒 carrito
router.get('/cart/:cid', async (req, res) => {
    const response = await CartService.getProductsFromCartByID(req.params.cid);

    if (response.status === 'error') {
        return res.status(404).render('notFound', {
            title: 'Not Found',
            style: 'index.css'
        });
    }

    res.render('cart', {
        title: 'Carrito',
        style: 'index.css',
        products: JSON.parse(JSON.stringify(response.products))
    });
});

// ❌ 404 FINAL
router.get('*', (req, res) => {
    res.status(404).render('notFound', {
        title: 'Not Found',
        style: 'index.css'
    });
});

export default router;
