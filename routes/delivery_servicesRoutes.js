import express from "express";
import {
  addDeliveryService,
  getDeliveryCompanyServices,
} from "../controllers/delivery_servicesCtrl.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/add-service", auth, addDeliveryService);
router.get("/:id", getDeliveryCompanyServices);

export default router;
