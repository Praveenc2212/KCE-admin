import asyncHandler from "../../utils/asyncHandler.util.js";
import { getStudents } from "../../services/student.service.js";

/**
 * GET /api/students
 * Supports: ?rollno, ?department, ?year, ?section (and combinations).
 */
const getStudentsController = asyncHandler(async (req, res) => {
  const students = await getStudents(req.query);

  res.status(200).json({
    success: true,
    message: "Students retrieved successfully",
    data: students,
  });
});

export default getStudentsController;
