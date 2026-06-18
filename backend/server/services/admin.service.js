import bcrypt from "bcryptjs";
import Admin from "../models/admin.model.js";
import AppError from "../utils/AppError.util.js";

/**
 * createAdmin
 * - Check for duplicate email
 * - Hash password
 * - Persist new admin
 * - Return sanitised admin data (no password)
 */
export const createAdmin = async (email, password) => {
  const existing = await Admin.findOne({ email });
  if (existing) {
    throw new AppError("An admin with this email already exists.", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await Admin.create({ email, password: hashedPassword });

  return { _id: admin._id, email: admin.email };
};

/**
 * getAllAdmins
 * - Return all admins without passwords
 */
export const getAllAdmins = async () => {
  const admins = await Admin.find().select("-password -__v");
  return admins.map((a) => ({ _id: a._id, email: a.email }));
};

/**
 * updateAdmin
 * - Find admin by MongoDB _id
 * - Optionally update email (with unique check excluding self)
 * - Optionally update password (with bcrypt hash)
 * - Return sanitised admin data (no password)
 *
 * @param {string} id             - Target admin's MongoDB _id
 * @param {Object} updates        - Fields to update: { email?, password? }
 */
export const updateAdmin = async (id, updates) => {
  const admin = await Admin.findById(id);
  if (!admin) {
    throw new AppError("Admin not found.", 404);
  }

  const { email, password } = updates;

  // ── Email update ────────────────────────────────────────────────────────────
  if (email !== undefined) {
    if (email.trim() === "") {
      throw new AppError("Email cannot be empty.", 400);
    }

    // Check uniqueness — exclude the admin being updated from the conflict check
    const conflict = await Admin.findOne({ email, _id: { $ne: id } });
    if (conflict) {
      throw new AppError("An admin with this email already exists.", 409);
    }

    admin.email = email;
  }

  // ── Password update ─────────────────────────────────────────────────────────
  if (password !== undefined) {
    if (password.trim() === "") {
      throw new AppError("Password cannot be empty.", 400);
    }
    admin.password = await bcrypt.hash(password, 12);
  }

  // ── Guard: nothing to update ────────────────────────────────────────────────
  if (email === undefined && password === undefined) {
    throw new AppError("No valid fields provided for update.", 400);
  }

  await admin.save();

  return { _id: admin._id, email: admin.email };
};

/**
 * deleteAdmin
 * - GUARD: Prevent deletion if this is the last admin (system lockout)
 * - GUARD: Prevent self-deletion (avoids dangling session confusion)
 * - Find admin by MongoDB _id and remove
 *
 * @param {string} id                 - Target admin's MongoDB _id
 * @param {string} requestingAdminId  - The calling admin's _id (from req.user)
 */
export const deleteAdmin = async (id, requestingAdminId) => {
  // ── Self-deletion guard ─────────────────────────────────────────────────────
  if (id.toString() === requestingAdminId.toString()) {
    throw new AppError("You cannot delete your own admin account.", 400);
  }

  // ── Last-admin guard ────────────────────────────────────────────────────────
  const totalAdmins = await Admin.countDocuments();
  if (totalAdmins === 1) {
    throw new AppError(
      "Cannot delete the last admin. At least one admin must remain in the system.",
      400
    );
  }

  const admin = await Admin.findByIdAndDelete(id);
  if (!admin) {
    throw new AppError("Admin not found.", 404);
  }
};
