import asyncHandler from "../../utils/asyncHandler.util.js";
import { getClasses } from "../../services/class.service.js";

/**
 * GET /api/class
 * Supports query filters: ?department, ?year, ?section
 * Protected — requires checkAuthentication middleware.
 *
 * Returns classes with tutor details populated.
 * Raw MongoDB ObjectIds are not exposed.
 */
const getClassesController = asyncHandler(async (req, res) => {
  const classes = await getClasses(req.query);

  res.status(200).json({
    success: true,
    message: "Classes retrieved successfully.",
    data: classes,
  });
});

export default getClassesController;
