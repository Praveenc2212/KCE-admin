import asyncHandler from "../../utils/asyncHandler.util.js";
import { getFaculties } from "../../services/faculty.service.js";

/**
 * GET /api/faculty
 * Supports query filters: ?staffId, ?department, ?designation
 * Protected — requires checkAuthentication middleware.
 */
const getFacultiesController = asyncHandler(async (req, res) => {
  const faculties = await getFaculties(req.query);

  res.status(200).json({
    success: true,
    message: "Faculties retrieved successfully.",
    data: faculties,
  });
});

export default getFacultiesController;
