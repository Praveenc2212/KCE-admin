import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";

/**
 * checkAuthentication Middleware
 *
 * 1. Reads JWT from HTTP-only cookie.
 * 2. Verifies the token using JWT_SECRET_KEY.
 * 3. Finds the Admin in the database by adminId from payload.
 * 4. Attaches the admin document (without password) to req.user.
 * 5. Calls next() to continue the request chain.
 *
 * Returns 401 if token is missing, invalid, or admin is not found.
 */
export const checkAuthentication = async (req, res, next) => {
  try {
    const token = req.cookies[process.env.JWT_TOKEN_NAME];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing.",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    const admin = await Admin.findById(decoded.adminId).select("-password");
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin not found.",
      });
    }

    req.user = { adminId: admin._id, email: admin.email };
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
