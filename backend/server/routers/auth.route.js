import express from "express";
import { checkAuthentication } from "../Middleware/checkAuthentication.middleware.js";
import loginController from "../controllers/Auth/login.controller.js";
import logoutController from "../controllers/Auth/logout.controller.js";
import authenticatedDataController from "../controllers/Auth/authenticatedData.controller.js";

const router = express.Router();

// POST /api/auth/login
router.post("/login", loginController);

// POST /api/auth/logout
router.post("/logout", logoutController);

// GET  /api/auth/me  (protected)
router.get("/me", checkAuthentication, authenticatedDataController);

export default router;
