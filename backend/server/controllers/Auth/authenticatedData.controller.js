import asyncHandler from "../../utils/asyncHandler.util.js";
import { getAuthenticatedAdmin } from "../../services/auth.service.js";

/**
 * GET /api/auth/me
 * Protected — requires checkAuthentication middleware.
 * Returns the currently authenticated admin (no password).
 */
const authenticatedDataController = asyncHandler(async (req, res) => {
  const adminData = await getAuthenticatedAdmin(req.user.adminId);

  res.status(200).json({
    success: true,
    message: "Authenticated admin retrieved.",
    data: adminData,
  });
});

export default authenticatedDataController;
