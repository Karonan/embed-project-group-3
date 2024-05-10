import express from "express";

import * as Controller from "../controllers/Controller.js";

const router = express.Router();

router.get("/", Controller.getItems);
router.post("/", Controller.createItem);

export default router;
