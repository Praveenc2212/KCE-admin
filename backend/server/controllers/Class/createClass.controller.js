import asyncHandler from "../../utils/asyncHandler.util.js";
import AppError from "../../utils/AppError.util.js";
import { createClass } from "../../services/class.service.js";

/**
 * POST /api/class
 * Body: { department, year, section, staffId }
 * Protected — requires checkAuthentication middleware.
 *
 * staffId must resolve to a STAFF faculty. All tutor eligibility rules
 * are enforced by the service's validateTutorCandidate helper.
 */
const createClassController = asyncHandler(async (req, res) => {
  const { department, year, section, staffId } = req.body;

  if (!department || !year || !section || !staffId) {
    throw new AppError(
      "department, year, section, and staffId are all required.",
      400
    );
  }

  const classData = await createClass(department, year, section, staffId);

  res.status(201).json({
    success: true,
    message: "Class created successfully.",
    data: classData,
  });
});

export default createClassController;
