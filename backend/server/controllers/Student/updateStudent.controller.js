import asyncHandler from "../../utils/asyncHandler.util.js";
import { updateStudentByRollno } from "../../services/student.service.js";

/**
 * PUT /api/students/:rollno
 * Identifies student by rollno param. Update fields come from req.body.
 */
const updateStudentController = asyncHandler(async (req, res) => {
  const { rollno } = req.params;

  const updated = await updateStudentByRollno(rollno, req.body);

  res.status(200).json({
    success: true,
    message: "Student updated successfully",
    data: updated,
  });
});

export default updateStudentController;
