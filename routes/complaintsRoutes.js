import express from 'express';
import { addComplaints, getComplaints } from '../controllers/complaintsCtrl.js';

const router = express.Router();

router.get('/', getComplaints);
router.post('/', addComplaints);

export default router;