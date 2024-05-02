import express from "express";
import {
  addToCartController,
  clearCartController,
  getCartController,
  updateCartController,
} from "../controllers/cart_ctrl.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/:userId", auth, getCartController);

router.post("/:userId", auth, addToCartController);

router.put("/:userId", auth, updateCartController);

router.delete("/:userId", auth, clearCartController);

export default router;
