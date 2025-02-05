import express from "express";
import { CarrierController } from "../controllers/carrier.controller";

const router = express.Router();

router.get("/dashboard", CarrierController.carrier);

export default router;
