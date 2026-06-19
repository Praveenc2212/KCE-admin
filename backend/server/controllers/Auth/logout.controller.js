import asyncHandler from "../../utils/asyncHandler.util.js";

/**
 * POST /api/auth/logout
 * Clears the auth cookie and returns success.
 *
 * IMPORTANT: clearCookie options MUST match the options used when the cookie
 * was originally set (GenerateJWT.util.js). A sameSite mismatch causes the
 * browser to silently ignore the clear, leaving the user authenticated.
 */
const logoutController = asyncHandler(async (req, res) => {
  res.clearCookie(process.env.JWT_TOKEN_NAME, {
    httpOnly: true,
    sameSite: "strict", // Must match GenerateJWT.util.js → sameSite: "strict"
    secure: process.env.STATUS !== "development",
  });

  res.status(200).json({
    success: true,
    message: "Logout successful.",
  });
});

export default logoutController;
