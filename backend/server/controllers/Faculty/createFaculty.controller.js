import asyncHandler from "../../utils/asyncHandler.util.js";
import AppError from "../../utils/AppError.util.js";
import { bulkCreateFaculties } from "../../services/faculty.service.js";

/**
 * POST /api/faculty/bulk-create
 * Body: { faculties: [...] }
 * Protected — requires checkAuthentication middleware.
 */
const createFacultyController = asyncHandler(async (req, res) => {
  const { faculties } = req.body;

  if (!faculties || !Array.isArray(faculties)) {
    throw new AppError("Faculties array is required.", 400);
  }

  if (faculties.length === 0) {
    throw new AppError("Faculties array cannot be empty.", 400);
  }

  const stats = await bulkCreateFaculties(faculties);

  res.status(201).json({
    success: true,
    message: "Faculty import completed.",
    data: stats,
  });
});

export default createFacultyController;
