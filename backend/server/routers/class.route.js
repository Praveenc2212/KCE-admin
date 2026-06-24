import express from "express";
import { checkAuthentication } from "../Middleware/checkAuthentication.middleware.js";
import createClassController from "../controllers/Class/createClass.controller.js";
import getClassesController from "../controllers/Class/getClasses.controller.js";
import updateClassController from "../controllers/Class/updateClass.controller.js";
import deleteClassController from "../controllers/Class/deleteClass.controller.js";

const router = express.Router();

// All class routes require authentication
router.use(checkAuthentication);

// POST   /api/class   - Create a new class with tutor assignment
//                       Body: { department, year, section, staffId }
router.post("/", createClassController);

// GET    /api/class   - Get all / filtered classes
//                       Query: ?department, ?year, ?section
router.get("/", getClassesController);

// PUT    /api/class   - Reassign class tutor (class identified by body)
//                       Body: { department, year, section, newStaffId }
router.put("/", updateClassController);

// DELETE /api/class   - Delete class and revert tutor (class identified by body)
//                       Body: { department, year, section }
router.delete("/", deleteClassController);

export default router;
