import express from "express";
import {
  addRealEstate,
  deleteRealEstate,
  editRealEstate,
  getAllRealEstate,
  getCompaniesRealEstates,
  getRealEstateById,
  getRealEstateCompanies,
} from "../controllers/real_estate_Ctrl.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/add-real-estate", auth, addRealEstate);
router.put("/edit-real-estate/:id", auth, editRealEstate);
router.delete("/delete-real-estate/:id", auth, deleteRealEstate);
router.get("/get-real-estate-companies", getRealEstateCompanies);
router.get("/get-companies-realestate/:id", getCompaniesRealEstates);
router.get("/getById/:id", getRealEstateById);
router.get("/", getAllRealEstate);

export default router;
