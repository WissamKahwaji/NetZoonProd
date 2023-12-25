import express from 'express';
import { getLegalAdvices } from '../controllers/legalAdviceCtrl.js';
import auth from '../middlewares/auth.js';

const router = express.Router();


router.get('/', getLegalAdvices);

export default router;