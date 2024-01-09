import express from "express";
import { addOpenions, getOpenions } from "../controllers/openionsCtrl.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getOpenions);
router.post("/", auth, addOpenions);

export default router;
