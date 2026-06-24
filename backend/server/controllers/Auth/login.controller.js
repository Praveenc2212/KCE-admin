import asyncHandler from "../../utils/asyncHandler.util.js";
import { loginAdmin } from "../../services/auth.service.js";

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const adminData = await loginAdmin(email, password, res);

  res.status(200).json({
    success: true,
    message: "Login successful.",
    data: adminData,
  });
});

export default loginController;
