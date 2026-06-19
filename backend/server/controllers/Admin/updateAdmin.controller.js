import asyncHandler from "../../utils/asyncHandler.util.js";
import AppError from "../../utils/AppError.util.js";
import { updateAdmin } from "../../services/admin.service.js";

/**
 * PUT /api/admins/:id
 * Protected — requires checkAuthentication middleware.
 *
 * Allowed fields in body:
 *   - email    (string) — must be unique
 *   - password (string) — will be bcrypt-hashed by the service
 *
 * Password is NEVER returned in the response.
 */
const updateAdminController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;

  // Reject if neither field is provided
  if (email === undefined && password === undefined) {
    throw new AppError("Provide at least one field to update: email or password.", 400);
  }

  const adminData = await updateAdmin(id, { email, password });

  res.status(200).json({
    success: true,
    message: "Admin updated successfully.",
    data: adminData,
  });
});

export default updateAdminController;
