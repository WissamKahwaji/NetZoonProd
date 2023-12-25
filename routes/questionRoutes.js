import express from 'express';
import { addQuestion, getQuestions } from '../controllers/questionsCtrl.js';


const router = express.Router();


router.get('/', getQuestions);
router.post('/', addQuestion);


export default router;