import { ClassModel } from "../models/class.model.js";
import { FacultyModel } from "../models/faculty.model.js";
import AppError from "../utils/AppError.util.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Finds a class document by its natural composite identity.
 *
 * @param {string} department
 * @param {string} year
 * @param {string} section
 * @returns {ClassDocument|null}
 */
const findClassByIdentity = async (department, year, section) => {
  return ClassModel.findOne({ department, year, section });
};

/**
 * validateTutorCandidate
 *
 * Enforces all rules for a faculty member to become a class tutor:
 *
 *   Rule 1: Faculty must exist.
 *   Rule 2: Designation must be STAFF.
 *             - TUTOR   → already a tutor (specific error)
 *             - HOD     → cannot be tutor (designation rule)
 *             - ADMIN   → cannot be tutor (designation rule)
 *             - PRINCE  → cannot be tutor (designation rule)
 *             - SECURITY → cannot be tutor (designation rule)
 *   Rule 3: Faculty must not already be in another class's tutorIds.
 *
 * Only STAFF → TUTOR is the valid transition.
 * This is the single authoritative check used by both createClass and updateClass.
 *
 * @param {string} staffId
 * @param {string|null} excludeClassId - The current class _id to exclude from Rule 3
 *                                       (prevents false conflict during tutor reassignment)
 * @returns {FacultyDocument} The validated faculty
 */
const validateTutorCandidate = async (staffId, excludeClassId = null) => {
  const faculty = await FacultyModel.findOne({ staffId });
  if (!faculty) {
    throw new AppError(`Faculty with staffId '${staffId}' not found.`, 404);
  }

  // Rule 2: Only STAFF may become a tutor
  if (faculty.designation !== "STAFF") {
    if (faculty.designation === "TUTOR") {
      throw new AppError(
        `Faculty '${staffId}' is already assigned as a class tutor. ` +
          `A faculty can only be tutor of one class at a time.`,
        400
      );
    }
    throw new AppError(
      `Faculty '${staffId}' has designation '${faculty.designation}'. ` +
        `Only STAFF faculty can be assigned as a class tutor.`,
      400
    );
  }

  // Rule 3: Not already in another class's tutorIds (authoritative DB check)
  const conflictQuery = { tutorIds: faculty._id };
  if (excludeClassId) conflictQuery._id = { $ne: excludeClassId };

  const existingAssignment = await ClassModel.findOne(conflictQuery);
  if (existingAssignment) {
    throw new AppError(
      `Faculty '${staffId}' is already assigned as a tutor in ` +
        `${existingAssignment.department} ${existingAssignment.year} ${existingAssignment.section}.`,
      400
    );
  }

  return faculty;
};

// ─── Service Functions ────────────────────────────────────────────────────────

/**
 * createClass
 *
 * Rules:
 *  1. department + year + section must be unique across all classes.
 *  2. staffId must resolve to a STAFF faculty (validateTutorCandidate enforces all rules).
 *  3. On success: create class, set faculty designation to TUTOR.
 *
 * @param {string} department
 * @param {string} year
 * @param {string} section
 * @param {string} staffId
 * @returns {Object} Created class with tutor info (no ObjectIds exposed)
 */
export const createClass = async (department, year, section, staffId) => {
  // 1. Uniqueness check
  const existing = await findClassByIdentity(department, year, section);
  if (existing) {
    throw new AppError(
      `Class ${department} ${year} ${section} already exists.`,
      409
    );
  }

  // 2. Validate tutor candidate — throws on any rule violation
  const faculty = await validateTutorCandidate(staffId);

  // 3. Create class
  const newClass = await ClassModel.create({
    department,
    year,
    section,
    tutorIds: [faculty._id],
  });

  // 4. Promote faculty: STAFF → TUTOR
  await FacultyModel.findByIdAndUpdate(faculty._id, { designation: "TUTOR" });

  return {
    department: newClass.department,
    year: newClass.year,
    section: newClass.section,
    tutor: {
      staffId: faculty.staffId,
      name: faculty.name,
      email: faculty.email,
      department: faculty.department,
      designation: "TUTOR",
    },
  };
};

/**
 * getClasses
 *
 * Returns class documents with tutor details populated.
 * Supported filters: department, year, section
 * Raw MongoDB ObjectIds are never exposed in the response.
 *
 * @param {Object} filters
 * @returns {Array} Shaped class objects
 */
export const getClasses = async (filters = {}) => {
  const { department, year, section } = filters;

  const filter = {};
  if (department) filter.department = department;
  if (year) filter.year = year;
  if (section) filter.section = section;

  const classes = await ClassModel.find(filter)
    .populate("tutorIds", "staffId name email department designation -_id")
    .select("-__v");

  return classes.map((c) => ({
    department: c.department,
    year: c.year,
    section: c.section,
    tutors: c.tutorIds, // populated — no raw ObjectIds
  }));
};

/**
 * updateClass
 *
 * Replaces the existing tutor with a new one.
 * Class is identified by department + year + section (body-based, no URL params).
 *
 * Safe execution order (prevents inconsistent state on failure):
 *   Step 1: Find class — abort immediately if not found.
 *   Step 2: Validate new tutor FIRST — zero state changes on validation failure.
 *   Step 3: Revert old tutor(s): TUTOR → STAFF.
 *   Step 4: Update class tutorIds to new faculty.
 *   Step 5: Promote new faculty: STAFF → TUTOR.
 *
 * @param {string} department
 * @param {string} year
 * @param {string} section
 * @param {string} newStaffId
 * @returns {Object} Updated class with new tutor info
 */
export const updateClass = async (department, year, section, newStaffId) => {
  // Step 1: Find class
  const classDoc = await findClassByIdentity(department, year, section);
  if (!classDoc) {
    throw new AppError(`Class ${department} ${year} ${section} not found.`, 404);
  }

  // Step 2: Validate new tutor BEFORE any state changes
  // excludeClassId: prevents "already assigned" conflict when reassigning the same tutor to this class
  const newFaculty = await validateTutorCandidate(newStaffId, classDoc._id);

  // Step 3: Revert old tutor(s): TUTOR → STAFF
  for (const tutorId of classDoc.tutorIds) {
    const oldTutor = await FacultyModel.findById(tutorId);
    if (oldTutor && oldTutor.designation === "TUTOR") {
      await FacultyModel.findByIdAndUpdate(tutorId, { designation: "STAFF" });
    }
  }

  // Step 4: Replace class tutorIds
  await ClassModel.findByIdAndUpdate(classDoc._id, {
    tutorIds: [newFaculty._id],
  });

  // Step 5: Promote new faculty: STAFF → TUTOR
  await FacultyModel.findByIdAndUpdate(newFaculty._id, { designation: "TUTOR" });

  return {
    department,
    year,
    section,
    newTutor: {
      staffId: newFaculty.staffId,
      name: newFaculty.name,
      email: newFaculty.email,
      department: newFaculty.department,
      designation: "TUTOR",
    },
  };
};

/**
 * deleteClass
 *
 * Reverts all tutor designations to STAFF before deleting the class.
 * Class is identified by department + year + section (body-based, no URL params).
 *
 * @param {string} department
 * @param {string} year
 * @param {string} section
 */
export const deleteClass = async (department, year, section) => {
  const classDoc = await findClassByIdentity(department, year, section);
  if (!classDoc) {
    throw new AppError(`Class ${department} ${year} ${section} not found.`, 404);
  }

  // Revert all assigned tutors: TUTOR → STAFF
  for (const tutorId of classDoc.tutorIds) {
    const tutor = await FacultyModel.findById(tutorId);
    if (tutor && tutor.designation === "TUTOR") {
      await FacultyModel.findByIdAndUpdate(tutorId, { designation: "STAFF" });
    }
  }

  await ClassModel.findByIdAndDelete(classDoc._id);
};
