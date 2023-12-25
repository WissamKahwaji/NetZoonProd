import express from 'express';
import { addRealEstate, deleteRealEstate, editRealEstate, getAllRealEstate, getCompaniesRealEstates, getRealEstateById, getRealEstateCompanies } from '../controllers/real_estate_Ctrl.js';
const router = express.Router();


router.post('/add-real-estate', addRealEstate);
router.put('/edit-real-estate/:id', editRealEstate);
router.delete('/delete-real-estate/:id', deleteRealEstate);
router.get('/get-real-estate-companies', getRealEstateCompanies);
router.get('/get-companies-realestate/:id', getCompaniesRealEstates);
router.get('/getById/:id',getRealEstateById);
router.get('/', getAllRealEstate);


export default router;