import express from "express";
import {
  calculateRateController,
  createPickUpController,
  createShipmentController,
  fetchCities,
} from "../controllers/aramex.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/calculateRate", auth, calculateRateController);
router.post("/createPickUp", auth, createPickUpController);
router.post("/createShipment", auth, createShipmentController);
router.post("/fetchCities", fetchCities);
export default router;
