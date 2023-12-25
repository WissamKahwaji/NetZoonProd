import express from 'express';
import { addRequest, getRequests } from '../controllers/requestsCtrl.js';

const router = express.Router();


router.get('/', getRequests);
router.post('/', addRequest);

export default router;