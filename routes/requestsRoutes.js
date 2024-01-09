import express from "express";
import { addRequest, getRequests } from "../controllers/requestsCtrl.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getRequests);
router.post("/", auth, addRequest);

export default router;
