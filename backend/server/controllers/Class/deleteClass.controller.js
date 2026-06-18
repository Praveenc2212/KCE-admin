import asyncHandler from "../../utils/asyncHandler.util.js";
import AppError from "../../utils/AppError.util.js";
import { deleteClass } from "../../services/class.service.js";

/**
 * DELETE /api/class
 * Body: { department, year, section }
 * Protected — requires checkAuthentication middleware.
 *
 * Class is identified by department + year + section in the request body.
 * Before deletion, all assigned tutors are reverted: TUTOR → STAFF.
 */
const deleteClassController = asyncHandler(async (req, res) => {
  const { department, year, section } = req.body;

  if (!department || !year || !section) {
    throw new AppError(
      "department, year, and section are required to identify the class.",
      400
    );
  }

  await deleteClass(department, year, section);

  res.status(200).json({
    success: true,
    message: "Class deleted successfully.",
  });
});

export default deleteClassController;
