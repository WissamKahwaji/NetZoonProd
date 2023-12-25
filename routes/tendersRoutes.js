import express from 'express';
import { addTender, getAllTenders, getAllTendersCategories, getTenderById, getTendersItemsbyMaxPrice, getTendersItemsbyMinPrice } from '../controllers/tendersCtrl.js';
import auth from '../middlewares/auth.js';
const router = express.Router();


router.get('/', getAllTendersCategories);
router.get('/alltendersItems', getAllTenders);
router.get('/itemsbyminprice', getTendersItemsbyMinPrice);
router.get('/itemsbymaxprice', getTendersItemsbyMaxPrice);
router.post('/add-tender', addTender);


router.get('/:id', getTenderById);



export default router;