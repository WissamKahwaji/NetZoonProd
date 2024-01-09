import express from "express";
import { addComplaints, getComplaints } from "../controllers/complaintsCtrl.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getComplaints);
router.post("/", auth, addComplaints);

export default router;
