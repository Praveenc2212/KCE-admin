import asyncHandler from "../../utils/asyncHandler.util.js";
import { getAllAdmins } from "../../services/admin.service.js";

/**
 * GET /api/admins
 * Protected — requires checkAuthentication middleware.
 * Returns list of all admins (no passwords).
 */
const getAdminsController = asyncHandler(async (req, res) => {
  const admins = await getAllAdmins();

  res.status(200).json({
    success: true,
    message: "Admins retrieved successfully.",
    data: admins,
  });
});

export default getAdminsController;
