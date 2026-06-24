import bcrypt from "bcryptjs";
import Admin from "../models/admin.model.js";
import AppError from "../utils/AppError.util.js";
import { GenerateJwtTokens } from "../utils/GenerateJWT.util.js";

/**
 * loginAdmin
 * - Find admin by email
 * - Compare password with bcrypt
 * - Generate JWT and set HTTP-only cookie
 * - Return sanitised admin data (no password)
 */
export const loginAdmin = async (email, password, res) => {
  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new AppError("Invalid email or password.", 401);
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password.", 401);
  }

  GenerateJwtTokens({ adminId: admin._id }, res);

  return { email: admin.email };
};

/**
 * getAuthenticatedAdmin
 * - Find admin by ID from JWT payload
 * - Return sanitised admin data (no password)
 */
export const getAuthenticatedAdmin = async (adminId) => {
  const admin = await Admin.findById(adminId).select("-password");
  if (!admin) {
    throw new AppError("Admin not found.", 404);
  }
  return { email: admin.email };
};
