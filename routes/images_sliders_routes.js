import express from "express";
import { getImagesSliders } from "../controllers/imges_sliders_ctrl.js";

const router = express.Router();

router.get("/", getImagesSliders);

export default router;
