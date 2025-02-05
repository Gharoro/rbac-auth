import express from "express";
import { AdminController } from "../controllers/admin.controller";

const router = express.Router();

router.get("/dashboard", AdminController.admin);
router.get("/users", AdminController.users);

export default router;
