import bcrypt from "bcryptjs";
import { FacultyModel } from "../models/faculty.model.js";
import { ClassModel } from "../models/class.model.js";
import AppError from "../utils/AppError.util.js";

// ─── Constants ────────────────────────────────────────────────────────────────

/**
 * Designations that may be set via the API.
 * TUTOR is intentionally excluded — only the Class Module controls tutor assignment.
 */
const API_ALLOWED_DESIGNATIONS = ["STAFF", "HOD", "ADMIN", "PRINCIPLE", "SECURITY"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Generates a plain-text password from a date of birth string.
 *
 * Format: "DD/MM/YYYY"
 * Rule:   Split by '/', strip leading zeros from each part, join.
 * Example: "20/07/2005" → ["20","07","2005"] → "2072005"
 *
 * @param {string} dateOfBirth
 * @returns {string} plain-text password
 */
const generatePasswordFromDOB = (dateOfBirth) => {
  return dateOfBirth
    .split("/")
    .map((part) => String(parseInt(part, 10))) // removes leading zeros
    .join("");
};

// ─── Service Functions ────────────────────────────────────────────────────────

/**
 * bulkCreateFaculties
 *
 * Per-record processing (in order):
 *  1. TUTOR designation → failedRecords (only Class Module assigns tutors)
 *  2. Invalid designation → failedRecords
 *  3. HOD without department → failedRecords
 *  4. Duplicate staffId → duplicateRecords (skip, do not crash)
 *  5. Duplicate email → duplicateRecords (skip, do not crash)
 *  6. Generate password from DOB → bcrypt hash
 *  7. Insert faculty document
 *
 * @param {Array} faculties - Raw faculty input array
 * @returns {Object} Import statistics
 */
export const bulkCreateFaculties = async (faculties) => {
  const stats = {
    total: faculties.length,
    inserted: 0,
    duplicates: 0,
    failed: 0,
    duplicateRecords: [],
    failedRecords: [],
  };

  for (const faculty of faculties) {
    const { staffId, name, email, dateOfBirth, department, designation } = faculty;

    // ── 1. TUTOR designation explicitly rejected ───────────────────────────
    if (designation === "TUTOR") {
      stats.failed++;
      stats.failedRecords.push({
        staffId,
        reason:
          "TUTOR designation cannot be assigned directly. Create a class assignment instead.",
      });
      continue;
    }

    // ── 2. Designation enum validation ─────────────────────────────────────
    if (!API_ALLOWED_DESIGNATIONS.includes(designation)) {
      stats.failed++;
      stats.failedRecords.push({
        staffId,
        reason: `Invalid designation: '${designation}'. Allowed: ${API_ALLOWED_DESIGNATIONS.join(", ")}.`,
      });
      continue;
    }

    // ── 3. HOD requires department ─────────────────────────────────────────
    if (designation === "HOD" && (!department || department.trim() === "")) {
      stats.failed++;
      stats.failedRecords.push({
        staffId,
        reason: "Department is mandatory when designation is HOD.",
      });
      continue;
    }

    // ── 4. Duplicate staffId check ─────────────────────────────────────────
    const existingByStaffId = await FacultyModel.findOne({ staffId });
    if (existingByStaffId) {
      stats.duplicates++;
      stats.duplicateRecords.push({ staffId, reason: "Staff ID already exists." });
      continue;
    }

    // ── 5. Duplicate email check ───────────────────────────────────────────
    const existingByEmail = await FacultyModel.findOne({ email });
    if (existingByEmail) {
      stats.duplicates++;
      stats.duplicateRecords.push({
        staffId,
        reason: `Email '${email}' already exists.`,
      });
      continue;
    }

    // ── 6. Password generation ─────────────────────────────────────────────
    const plainPassword = generatePasswordFromDOB(dateOfBirth);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // ── 7. Insert ──────────────────────────────────────────────────────────
    try {
      await FacultyModel.create({
        staffId,
        name,
        email,
        password: hashedPassword,
        department,
        designation,
      });
      stats.inserted++;
    } catch (err) {
      stats.failed++;
      stats.failedRecords.push({ staffId, reason: err.message });
    }
  }

  return stats;
};

/**
 * getFaculties
 *
 * Returns faculty documents matching optional filters.
 * Supported filters: staffId, department, designation
 * Password is never returned.
 *
 * @param {Object} filters
 * @returns {Array} Faculty documents
 */
export const getFaculties = async (filters = {}) => {
  const { staffId, department, designation } = filters;

  const filter = {};
  if (staffId) filter.staffId = staffId;
  if (department) filter.department = department;
  if (designation) filter.designation = designation;

  return FacultyModel.find(filter).select("-password -__v");
};

/**
 * updateFacultyByStaffId
 *
 * Allowed update fields: name, email, department, designation, dateOfBirth
 *
 * Business rules:
 *  - TUTOR must never be accepted as a designation from the API
 *  - Designation change is blocked if faculty is currently an active class tutor
 *  - Email must remain unique (excluding the faculty being updated)
 *  - If resulting designation is HOD, department must be non-empty
 *  - dateOfBirth update regenerates the bcrypt password hash
 *
 * @param {string} staffId
 * @param {Object} updateData
 * @returns {Object} Updated faculty (no password)
 */
export const updateFacultyByStaffId = async (staffId, updateData) => {
  const faculty = await FacultyModel.findOne({ staffId });
  if (!faculty) {
    throw new AppError(`Faculty with staffId '${staffId}' not found.`, 404);
  }

  const { name, email, department, designation, dateOfBirth } = updateData;
  const fieldsToUpdate = {};

  // ── Name ──────────────────────────────────────────────────────────────────
  if (name !== undefined) {
    fieldsToUpdate.name = name;
  }

  // ── Email ─────────────────────────────────────────────────────────────────
  if (email !== undefined) {
    if (!email || email.trim() === "") {
      throw new AppError("Email cannot be empty.", 400);
    }
    // Exclude current faculty from uniqueness check (update to same email is fine)
    const conflict = await FacultyModel.findOne({ email, staffId: { $ne: staffId } });
    if (conflict) {
      throw new AppError("A faculty with this email already exists.", 409);
    }
    fieldsToUpdate.email = email;
  }

  // ── Department ────────────────────────────────────────────────────────────
  if (department !== undefined) {
    fieldsToUpdate.department = department;
  }

  // ── Designation ───────────────────────────────────────────────────────────
  if (designation !== undefined) {
    // TUTOR must never be accepted from the API
    if (designation === "TUTOR") {
      throw new AppError(
        "TUTOR designation cannot be assigned directly. Create a class assignment instead.",
        400
      );
    }

    if (!API_ALLOWED_DESIGNATIONS.includes(designation)) {
      throw new AppError(
        `Invalid designation: '${designation}'. Allowed: ${API_ALLOWED_DESIGNATIONS.join(", ")}.`,
        400
      );
    }

    // Block designation change if faculty is currently an active class tutor
    if (faculty.designation === "TUTOR") {
      throw new AppError(
        "Cannot change designation of a faculty currently assigned as a class tutor. Remove the tutor assignment first.",
        400
      );
    }

    fieldsToUpdate.designation = designation;
  }

  // ── HOD cross-field validation ────────────────────────────────────────────
  // Check the final state (proposed change OR existing value) for HOD rule
  const resultingDesignation = designation ?? faculty.designation;
  const resultingDepartment = department ?? faculty.department;
  if (resultingDesignation === "HOD" && (!resultingDepartment || resultingDepartment.trim() === "")) {
    throw new AppError("Department is mandatory when designation is HOD.", 400);
  }

  // ── Date of Birth → Password regeneration ────────────────────────────────
  if (dateOfBirth !== undefined) {
    const plainPassword = generatePasswordFromDOB(dateOfBirth);
    fieldsToUpdate.password = await bcrypt.hash(plainPassword, 10);
  }

  // ── Guard: nothing to update ──────────────────────────────────────────────
  if (Object.keys(fieldsToUpdate).length === 0) {
    throw new AppError("No valid fields provided for update.", 400);
  }

  const updated = await FacultyModel.findOneAndUpdate(
    { staffId },
    { $set: fieldsToUpdate },
    { new: true, runValidators: true }
  ).select("-password -__v");

  return updated;
};

/**
 * deleteFacultyByStaffId
 *
 * Rejects deletion if faculty is currently assigned as a class tutor.
 * The Class Module must remove the assignment first.
 *
 * @param {string} staffId
 */
export const deleteFacultyByStaffId = async (staffId) => {
  const faculty = await FacultyModel.findOne({ staffId });
  if (!faculty) {
    throw new AppError(`Faculty with staffId '${staffId}' not found.`, 404);
  }

  // Block deletion if faculty is in any class's tutorIds array
  const assignedClass = await ClassModel.findOne({ tutorIds: faculty._id });
  if (assignedClass) {
    throw new AppError(
      `Faculty is currently assigned as a class tutor ` +
        `(${assignedClass.department} ${assignedClass.year} ${assignedClass.section}). ` +
        `Remove the tutor assignment before deleting this faculty.`,
      400
    );
  }

  await FacultyModel.findOneAndDelete({ staffId });
};
