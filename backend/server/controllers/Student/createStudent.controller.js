import asyncHandler from "../../utils/asyncHandler.util.js";
import AppError from "../../utils/AppError.util.js";
import { bulkCreateStudents } from "../../services/student.service.js";

/**
 * POST /api/students/bulk-create
 * Accepts { students: [...] } and delegates entirely to the service.
 */
const createStudentController = asyncHandler(async (req, res) => {
  const { students } = req.body;

  if (!students || !Array.isArray(students)) {
    throw new AppError("Students array is required", 400);
  }

  const stats = await bulkCreateStudents(students);

  res.status(201).json({
    success: true,
    message: "Student import completed",
    data: stats,
  });
});

export default createStudentController;

