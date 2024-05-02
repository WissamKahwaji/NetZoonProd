import express from "express";
import {
  createTheOrder,
  deleteOrder,
  findAll,
  getClientOrders,
  getOrderById,
  getUserOrders,
  saveOrder,
  updateTheOrder,
} from "../controllers/orderCtrl.js";
import auth from "../middlewares/auth.js";
import { createPaymentIntent } from "../services/stripe_test.js";

const router = express.Router();
router.post("/create-payment", createPaymentIntent);
router.get("/order/:userId", findAll);
router.get("/get/:userId", getUserOrders);
router.get("/client-orders/:clientId", getClientOrders);
router.post("/order/:userId", auth, createTheOrder);
router.put("/order/update-order/:userId", auth, updateTheOrder);
router.post("/save/:userId", auth, saveOrder);
router.delete("/delete/:id", auth, deleteOrder);
router.get("/:id", getOrderById);

export default router;
