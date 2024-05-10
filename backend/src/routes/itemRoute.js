import express from "express";

import * as Controller from "../controllers/Controller.js";

const router = express.Router();

router.get("/status", Controller.getStatus);
router.post("/postHeight", Controller.updateHeight);
router.post("/toggle", Controller.togglePump);
router.post("/setMode", Controller.setMode);

export default router;
