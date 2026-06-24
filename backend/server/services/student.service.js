import bcrypt from "bcryptjs";
import { StudentModel } from "../models/student.model.js";
import { ClassModel } from "../models/class.model.js";
import AppError from "../utils/AppError.util.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Generates a password string from a DOB string.
 *
 * DOB format: "DD/MM/YYYY"
 * Rule: remove '/', remove leading zeros from each part.
 * Example: "20/07/2005" → parts ["20","07","2005"] → "2072005"
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

/**
 * Finds a class by its natural identity (department + year + section).
 * Returns the class document or null.
 */
const findClassByIdentity = async (department, year, section) => {
  return ClassModel.findOne({ department, year, section });
};

// ─── Service Functions ────────────────────────────────────────────────────────

/**
 * Bulk creates students from an array of raw input records.
 *
 * Per-record processing:
 *  1. Check rollno duplicate → skip if exists.
 *  2. Resolve class from department + year + section → reject if not found.
 *  3. Generate password from DOB → bcrypt hash.
 *  4. Insert student.
 *
 * @param {Array} students - Array of raw student input objects
 * @returns {Object} Import statistics
 */
export const bulkCreateStudents = async (students) => {
  const stats = {
    total: students.length,
    inserted: 0,
    duplicates: 0,
    failed: 0,
    duplicateRecords: [],
    failedRecords: [],
  };

  const VALID_STUDENT_TYPES = ["HOSTELLER", "DAYSCHOLAR"];

  for (const student of students) {
    const { rollno, name, gender, email, dateOfBirth, department, year, section, studentType } = student;

    // ── 1. studentType validation ─────────────────────────────────────────────
    if (!VALID_STUDENT_TYPES.includes(studentType)) {
      stats.failed++;
      stats.failedRecords.push({ rollno, reason: "Invalid studentType" });
      continue;
    }

    // ── 2. Duplicate check ────────────────────────────────────────────────────
    const exists = await StudentModel.findOne({ rollno });
    if (exists) {
      stats.duplicates++;
      stats.duplicateRecords.push({ rollno, reason: "Roll number already exists" });
      continue;
    }

    // ── 3. Class resolution ───────────────────────────────────────────────────
    const classDoc = await findClassByIdentity(department, year, section);
    if (!classDoc) {
      stats.failed++;
      stats.failedRecords.push({
        rollno,
        reason: `Class not found for ${department} / ${year} / ${section}`,
      });
      continue;
    }

    // ── 4. Password generation ────────────────────────────────────────────────
    const plainPassword = generatePasswordFromDOB(dateOfBirth);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // ── 5. Insert ─────────────────────────────────────────────────────────────
    try {
      await StudentModel.create({
        name,
        rollno,
        gender,
        email,
        password: hashedPassword,
        classId: classDoc._id,
        studentType,
      });
      stats.inserted++;
    } catch (err) {
      stats.failed++;
      stats.failedRecords.push({ rollno, reason: err.message });
    }
  }

  return stats;
};

/**
 * Retrieves students with optional filters.
 * Filters: rollno, department, year, section (resolved via class lookup).
 * Always populates classId with department, year, section.
 *
 * @param {Object} filters - Query filters from request
 * @returns {Array} Student documents
 */
export const getStudents = async (filters = {}) => {
  const { rollno, department, year, section } = filters;

  // Build student-level filter
  const studentFilter = {};
  if (rollno) studentFilter.rollno = rollno;

  // If class-level filters are provided, resolve matching class IDs first
  if (department || year || section) {
    const classFilter = {};
    if (department) classFilter.department = department;
    if (year) classFilter.year = year;
    if (section) classFilter.section = section;

    const matchingClasses = await ClassModel.find(classFilter).select("_id");
    const classIds = matchingClasses.map((c) => c._id);

    studentFilter.classId = { $in: classIds };
  }

  const students = await StudentModel.find(studentFilter)
    .populate("classId", "department year section -_id")
    .select("-password -__v");

  return students;
};

/**
 * Updates a student identified by rollno.
 * If department/year/section are included in updateData, re-resolves classId.
 *
 * @param {string} rollno
 * @param {Object} updateData
 * @returns {Object} Updated student document
 */
export const updateStudentByRollno = async (rollno, updateData) => {
  // Populate classId so class fields (department/year/section) are accessible
  // during partial class reassignment without relying on a bare ObjectId.
  const student = await StudentModel.findOne({ rollno }).populate("classId");
  if (!student) {
    throw new AppError(`Student with rollno '${rollno}' not found`, 404);
  }

  const { department, year, section, dateOfBirth, ...rest } = updateData;

  const fieldsToUpdate = { ...rest };

  // ── Class reassignment ────────────────────────────────────────────────────
  if (department || year || section) {
    // Resolve new class using updated + existing values
    const targetDept = department || student.classId?.department;
    const targetYear = year || student.classId?.year;
    const targetSection = section || student.classId?.section;

    const classDoc = await findClassByIdentity(targetDept, targetYear, targetSection);
    if (!classDoc) {
      throw new AppError(
        `Class not found for ${targetDept} / ${targetYear} / ${targetSection}`,
        404
      );
    }
    fieldsToUpdate.classId = classDoc._id;
  }

  // ── Password change via new DOB ───────────────────────────────────────────
  if (dateOfBirth) {
    const plainPassword = generatePasswordFromDOB(dateOfBirth);
    fieldsToUpdate.password = await bcrypt.hash(plainPassword, 10);
  }

  const updated = await StudentModel.findOneAndUpdate(
    { rollno },
    { $set: fieldsToUpdate },
    { new: true, runValidators: true }
  )
    .populate("classId", "department year section -_id")
    .select("-password -__v");

  return updated;
};

/**
 * Deletes a student identified by rollno.
 *
 * @param {string} rollno
 */
export const deleteStudentByRollno = async (rollno) => {
  const student = await StudentModel.findOneAndDelete({ rollno });
  if (!student) {
    throw new AppError(`Student with rollno '${rollno}' not found`, 404);
  }
};
