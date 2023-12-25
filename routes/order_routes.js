import express from 'express';
import { createTheOrder, deleteOrder, findAll, getClientOrders, getOrderById, getUserOrders, saveOrder, updateTheOrder } from '../controllers/orderCtrl.js'



const router = express.Router();





router.get('/order/:userId', findAll);
router.get('/get/:userId', getUserOrders);
router.get('/client-orders/:clientId', getClientOrders);
router.post('/order/:userId', createTheOrder);
router.put('/order/:userId', updateTheOrder);
router.post('/save/:userId', saveOrder);
router.delete('/delete/:id', deleteOrder);
router.get('/:id', getOrderById);



export default router;