import express from 'express';
import { addOpenions, getOpenions } from '../controllers/openionsCtrl.js';


const router = express.Router();


router.get('/', getOpenions);
router.post('/', addOpenions);


export default router;