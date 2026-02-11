import { Router } from 'express';
import { productDBManager } from '../dao/productDBManager.js';
import { cartDBManager } from '../dao/cartDBManager.js';
import { ticketDBManager } from '../dao/ticketDBManager.js';
import { cartRepository } from '../repositories/cartRepository.js';
import { requireAuth, authorizeRoles, authorizeCartAccess } from '../middlewares/authMiddleware.js';

const router = Router();
const ProductService = new productDBManager();
const CartDAO = new cartDBManager(ProductService);
const TicketDAO = new ticketDBManager();
const CartService = new cartRepository(CartDAO, ProductService, TicketDAO);

router.get('/:cid', requireAuth, authorizeRoles('user', 'admin'), authorizeCartAccess, async (req, res) => {

    try {
        const result = await CartService.getProductsFromCartByID(req.params.cid);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.post('/', requireAuth, authorizeRoles('admin'), async (req, res) => {

    try {
        const result = await CartService.createCart();
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.post('/:cid/product/:pid', requireAuth, authorizeRoles('user', 'admin'), authorizeCartAccess, async (req, res) => {

    try {
        const result = await CartService.addProductByID(req.params.cid, req.params.pid)
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.delete('/:cid/product/:pid', requireAuth, authorizeRoles('user', 'admin'), authorizeCartAccess, async (req, res) => {

    try {
        const result = await CartService.deleteProductByID(req.params.cid, req.params.pid)
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.put('/:cid', requireAuth, authorizeRoles('user', 'admin'), authorizeCartAccess, async (req, res) => {

    try {
        const result = await CartService.updateAllProducts(req.params.cid, req.body.products)
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.put('/:cid/product/:pid', requireAuth, authorizeRoles('user', 'admin'), authorizeCartAccess, async (req, res) => {

    try {
        const result = await CartService.updateProductByID(req.params.cid, req.params.pid, req.body.quantity)
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.delete('/:cid', requireAuth, authorizeRoles('user', 'admin'), authorizeCartAccess, async (req, res) => {

    try {
        const result = await CartService.deleteAllProducts(req.params.cid)
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.post('/:cid/purchase', requireAuth, authorizeRoles('user', 'admin'), authorizeCartAccess, async (req, res) => {

    try {
        const result = await CartService.purchase(req.params.cid, req.user.email);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

export default router;
