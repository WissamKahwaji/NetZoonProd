import express from "express";
import {
  getRefundedProducts,
  getUserRefundedProducts,
} from "../controllers/refunded_products_ctrl.js";
import auth from "../middlewares/auth.js";
const router = express.Router();

router.get("/", getRefundedProducts);
router.get("/by-user", auth, getUserRefundedProducts);

export default router;
