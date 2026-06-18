import express from "express";
import { checkAuthentication } from "../Middleware/checkAuthentication.middleware.js";
import createStudentController from "../controllers/Student/createStudent.controller.js";
import getStudentsController from "../controllers/Student/getStudents.controller.js";
import updateStudentController from "../controllers/Student/updateStudent.controller.js";
import deleteStudentController from "../controllers/Student/deleteStudent.controller.js";

const router = express.Router();

// All student routes require authentication
router.use(checkAuthentication);

// POST   /api/students/bulk-create  - Bulk insert students
router.post("/bulk-create", createStudentController);

// GET    /api/students              - Get all / filtered students
router.get("/", getStudentsController);

// PUT    /api/students/:rollno      - Update student by roll number
router.put("/:rollno", updateStudentController);

// DELETE /api/students/:rollno      - Delete student by roll number
router.delete("/:rollno", deleteStudentController);

export default router;
