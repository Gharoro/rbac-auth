import express from "express";
import { ShipperController } from "../controllers/shipper.controller";

const router = express.Router();

router.get("/dashboard", ShipperController.shipper);

export default router;
