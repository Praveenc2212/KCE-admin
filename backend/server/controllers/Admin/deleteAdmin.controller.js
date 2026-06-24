import asyncHandler from "../../utils/asyncHandler.util.js";
import { deleteAdmin } from "../../services/admin.service.js";

/**
 * DELETE /api/admins/:id
 * Protected — requires checkAuthentication middleware.
 * Deletes admin by MongoDB _id.
 *
 * Guards (enforced in service):
 *   - Cannot delete your own account (self-deletion)
 *   - Cannot delete the last remaining admin (system lockout)
 */
const deleteAdminController = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // req.user is set by checkAuthentication middleware
  await deleteAdmin(id, req.user.adminId);

  res.status(200).json({
    success: true,
    message: "Admin deleted successfully.",
  });
});

export default deleteAdminController;
