import asyncHandler from "../../utils/asyncHandler.util.js";
import { createAdmin } from "../../services/admin.service.js";

/**
 * POST /api/admins
 * Protected — requires checkAuthentication middleware.
 * Body: { email, password }
 */
const createAdminController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const adminData = await createAdmin(email, password);

  res.status(201).json({
    success: true,
    message: "Admin created successfully.",
    data: adminData,
  });
});

export default createAdminController;
