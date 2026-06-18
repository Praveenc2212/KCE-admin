import asyncHandler from "../../utils/asyncHandler.util.js";
import { deleteFacultyByStaffId } from "../../services/faculty.service.js";

/**
 * DELETE /api/faculty/:staffId
 * Protected — requires checkAuthentication middleware.
 *
 * Deletion is rejected by the service if the faculty is currently
 * assigned as a class tutor. Remove the assignment via the Class Module first.
 */
const deleteFacultyController = asyncHandler(async (req, res) => {
  const { staffId } = req.params;

  await deleteFacultyByStaffId(staffId);

  res.status(200).json({
    success: true,
    message: "Faculty deleted successfully.",
  });
});

export default deleteFacultyController;
