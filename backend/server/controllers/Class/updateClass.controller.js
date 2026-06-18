import asyncHandler from "../../utils/asyncHandler.util.js";
import AppError from "../../utils/AppError.util.js";
import { updateClass } from "../../services/class.service.js";

/**
 * PUT /api/class
 * Body: { department, year, section, newStaffId }
 * Protected — requires checkAuthentication middleware.
 *
 * Class is identified by department + year + section in the request body.
 * newStaffId must resolve to a STAFF faculty not assigned elsewhere.
 *
 * The service validates the new tutor BEFORE reverting the old one,
 * ensuring no state corruption on validation failure.
 */
const updateClassController = asyncHandler(async (req, res) => {
  const { department, year, section, newStaffId } = req.body;

  if (!department || !year || !section) {
    throw new AppError(
      "department, year, and section are required to identify the class.",
      400
    );
  }

  if (!newStaffId) {
    throw new AppError("newStaffId is required.", 400);
  }

  const result = await updateClass(department, year, section, newStaffId);

  res.status(200).json({
    success: true,
    message: "Class tutor updated successfully.",
    data: result,
  });
});

export default updateClassController;
