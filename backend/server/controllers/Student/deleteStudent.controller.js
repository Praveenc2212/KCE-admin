import asyncHandler from "../../utils/asyncHandler.util.js";
import { deleteStudentByRollno } from "../../services/student.service.js";

/**
 * DELETE /api/students/:rollno
 * Deletes the student identified by rollno. Service throws AppError 404 if not found.
 */
const deleteStudentController = asyncHandler(async (req, res) => {
  const { rollno } = req.params;

  await deleteStudentByRollno(rollno);

  res.status(200).json({
    success: true,
    message: "Student deleted successfully",
  });
});

export default deleteStudentController;
