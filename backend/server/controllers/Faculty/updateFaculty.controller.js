import asyncHandler from "../../utils/asyncHandler.util.js";
import { updateFacultyByStaffId } from "../../services/faculty.service.js";

/**
 * PUT /api/faculty/:staffId
 * Body: { name?, email?, department?, designation?, dateOfBirth? }
 * Protected — requires checkAuthentication middleware.
 *
 * All field validation and business rules are enforced in the service.
 */
const updateFacultyController = asyncHandler(async (req, res) => {
  const { staffId } = req.params;

  const updated = await updateFacultyByStaffId(staffId, req.body);

  res.status(200).json({
    success: true,
    message: "Faculty updated successfully.",
    data: updated,
  });
});

export default updateFacultyController;
