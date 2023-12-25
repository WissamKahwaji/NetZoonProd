import express from "express";
import {
  AddDeal,
  deleteDeal,
  editDeal,
  getAllDeals,
  getAllDealsByCat,
  getAllDealsCategories,
  getDealById,
  getUserDeals,
  getUserPurchDeal,
  savePurchDeal,
} from "../controllers/dealsCtrl.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getAllDealsCategories);
router.get("/alldealsItems", getAllDeals);
router.get("/dealsByCat", getAllDealsByCat);
router.get("/:id", getDealById);
router.get("/userDeals/:userId", getUserDeals);
router.post("/addDeal", AddDeal);
router.put("/:id", editDeal);
router.delete("/:id", deleteDeal);
router.post("/purch/save/:userId", savePurchDeal);
router.get("/purch/:userId", getUserPurchDeal);

export default router;
