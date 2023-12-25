import express from 'express';
import { addNumberOfVisitors, createAds, deleteAdvertisement, editAdvertisement, getAdvertisementById, getAdvertisementByType, getAdvertisements, getUserAds, getUserPurchAds, savePurchAds } from '../controllers/advertisementsCtrl.js';
import auth from '../middlewares/auth.js';
const router = express.Router();


router.get('/', getAdvertisements);
router.post('/createAds', createAds);
router.get('/getbytype/:userAdvertisingType', getAdvertisementByType);
router.get('/getUserAds/:userId', getUserAds);
router.get('/:id', getAdvertisementById);
router.put('/:id', editAdvertisement);
router.delete('/:id', deleteAdvertisement);
router.put('/:adsId/addvisitor', addNumberOfVisitors);
router.post('/purch/save/:userId', savePurchAds);
router.get('/purch/:userId', getUserPurchAds);

export default router;