import express from "express";
import { checkAuthentication } from "../Middleware/checkAuthentication.middleware.js";
import createFacultyController from "../controllers/Faculty/createFaculty.controller.js";
import getFacultiesController from "../controllers/Faculty/getFaculties.controller.js";
import updateFacultyController from "../controllers/Faculty/updateFaculty.controller.js";
import deleteFacultyController from "../controllers/Faculty/deleteFaculty.controller.js";

const router = express.Router();

// All faculty routes require authentication
router.use(checkAuthentication);

// POST   /api/faculty/bulk-create   - Bulk insert faculties
router.post("/bulk-create", createFacultyController);

// GET    /api/faculty               - Get all / filtered faculties (?staffId, ?department, ?designation)
router.get("/", getFacultiesController);

// PUT    /api/faculty/:staffId      - Update faculty by staffId
router.put("/:staffId", updateFacultyController);

// DELETE /api/faculty/:staffId      - Delete faculty by staffId
router.delete("/:staffId", deleteFacultyController);

export default router;
