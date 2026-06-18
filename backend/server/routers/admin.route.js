import express from "express";
import { checkAuthentication } from "../Middleware/checkAuthentication.middleware.js";
import createAdminController from "../controllers/Admin/createAdmin.controller.js";
import getAdminsController from "../controllers/Admin/getAdmins.controller.js";
import updateAdminController from "../controllers/Admin/updateAdmin.controller.js";
import deleteAdminController from "../controllers/Admin/deleteAdmin.controller.js";

const router = express.Router();

// All admin management routes require authentication
router.use(checkAuthentication);

// POST   /api/admins       - Create a new admin (protected)
router.post("/", createAdminController);

// GET    /api/admins       - Get all admins (protected)
router.get("/", getAdminsController);

// PUT    /api/admins/:id   - Update admin email or password (protected)
router.put("/:id", updateAdminController);

// DELETE /api/admins/:id   - Delete admin by MongoDB ID (protected)
router.delete("/:id", deleteAdminController);

export default router;

