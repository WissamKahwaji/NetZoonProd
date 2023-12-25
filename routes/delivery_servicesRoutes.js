import express from 'express';
import { addDeliveryService, getDeliveryCompanyServices } from '../controllers/delivery_servicesCtrl.js';


const router = express.Router();


router.post('/add-service', addDeliveryService);
router.get('/:id', getDeliveryCompanyServices);





export default router;