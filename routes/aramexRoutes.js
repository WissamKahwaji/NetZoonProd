import express from "express";
import {
  calculateRateController,
  createPickUpController,
  createShipmentController,
  fetchCities,
  trackPickup,
  trackShipments,
} from "../controllers/aramex.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/calculateRate", auth, calculateRateController);
router.post("/createPickUp", auth, createPickUpController);
router.post("/createShipment", auth, createShipmentController);
router.post("/fetchCities", fetchCities);
router.post("/track-pickup", auth, trackPickup);
router.post("/track-shipments", auth, trackShipments);
export default router;
