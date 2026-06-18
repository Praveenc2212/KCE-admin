# Testing Checklist — KCE Admin Portal Backend

**Tool:** Postman (or any HTTP client)  
**Base URL:** `http://localhost:<SERVER_PORT>/api`  
**Auth:** Login first via `POST /api/auth/login` to obtain the session cookie before running protected tests.

**Legend:**
- `[ ]` — Not yet tested
- `[✓]` — Passed
- `[✗]` — Failed

---

## Authentication

### POST /api/auth/login

#### Success Cases
- `[ ]` **TC-AUTH-001** — Valid login  
  Request: `{ "email": "admin@example.com", "password": "correct" }`  
  Expected: `200`, `success: true`, cookie set, email returned

#### Validation Failures
- `[ ]` **TC-AUTH-002** — Wrong password  
  Request: `{ "email": "admin@example.com", "password": "wrong" }`  
  Expected: `401`, `"Invalid email or password."`

- `[ ]` **TC-AUTH-003** — Non-existent email  
  Request: `{ "email": "nobody@example.com", "password": "anything" }`  
  Expected: `401`, `"Invalid email or password."` *(same message — no user enumeration)*

- `[ ]` **TC-AUTH-004** — Empty body  
  Request: `{}`  
  Expected: `401`

---

### POST /api/auth/logout

#### Success Cases
- `[ ]` **TC-AUTH-005** — Logout with valid session  
  Expected: `200`, `success: true`, cookie cleared

- `[ ]` **TC-AUTH-006** — Logout without a cookie  
  Expected: `200` *(idempotent — does not error)*

---

### GET /api/auth/me

#### Success Cases
- `[ ]` **TC-AUTH-007** — Authenticated user fetches their profile  
  Expected: `200`, `success: true`, `data.email` returned, no password in response

#### Authentication Cases
- `[ ]` **TC-AUTH-008** — No cookie / missing token  
  Expected: `401`, `"Authentication token missing."`

- `[ ]` **TC-AUTH-009** — Invalid/tampered token  
  Expected: `401`, `"Invalid or expired token."`

- `[ ]` **TC-AUTH-010** — Expired token  
  Expected: `401`, `"Invalid or expired token."`

- `[ ]` **TC-AUTH-011** — Logged out user attempts access  
  Steps: Login → Logout → Call `/api/auth/me`  
  Expected: `401`, `"Authentication token missing."`

---

## Admin

### POST /api/admins

#### Success Cases
- `[ ]` **TC-ADM-001** — Create admin with unique email  
  Request: `{ "email": "new@example.com", "password": "pass123" }`  
  Expected: `201`, `success: true`, `_id` and `email` returned, no password in response

#### Validation Failures
- `[ ]` **TC-ADM-002** — Missing email  
  Request: `{ "password": "pass123" }`  
  Expected: `4xx` error *(Mongoose validation or AppError)*

- `[ ]` **TC-ADM-003** — Missing password  
  Request: `{ "email": "new@example.com" }`  
  Expected: `4xx` error

#### Duplicate Cases
- `[ ]` **TC-ADM-004** — Duplicate email  
  Request: email already in DB  
  Expected: `409`, `"An admin with this email already exists."`

#### Authentication Cases
- `[ ]` **TC-ADM-005** — No token  
  Expected: `401`, `"Authentication token missing."`

---

### GET /api/admins

#### Success Cases
- `[ ]` **TC-ADM-006** — Get all admins  
  Expected: `200`, `success: true`, array of `{ _id, email }`, no passwords

#### Authentication Cases
- `[ ]` **TC-ADM-007** — No token  
  Expected: `401`, `"Authentication token missing."`

---

### PUT /api/admins/:id

#### Success Cases
- `[ ]` **TC-ADM-008** — Update email only  
  Request: `{ "email": "updated@example.com" }`, valid `:id`  
  Expected: `200`, updated email returned

- `[ ]` **TC-ADM-009** — Update password only  
  Request: `{ "password": "newpass" }`, valid `:id`  
  Expected: `200`, `email` returned, no password in response

- `[ ]` **TC-ADM-010** — Update both email and password  
  Expected: `200`

- `[ ]` **TC-ADM-011** — Re-submit same email (no change)  
  Expected: `200` *(self-exclusion in uniqueness check allows this)*

#### Validation Failures
- `[ ]` **TC-ADM-012** — Empty body (no fields)  
  Request: `{}`  
  Expected: `400`, `"Provide at least one field to update: email or password."`

- `[ ]` **TC-ADM-013** — Email set to empty string  
  Request: `{ "email": "" }`  
  Expected: `400`, `"Email cannot be empty."`

- `[ ]` **TC-ADM-014** — Password set to empty string  
  Request: `{ "password": "" }`  
  Expected: `400`, `"Password cannot be empty."`

#### Duplicate Cases
- `[ ]` **TC-ADM-015** — Email already used by another admin  
  Expected: `409`, `"An admin with this email already exists."`

#### Authentication Cases
- `[ ]` **TC-ADM-016** — No token  
  Expected: `401`, `"Authentication token missing."`

- `[ ]` **TC-ADM-017** — Invalid `:id` (non-existent)  
  Expected: `404`, `"Admin not found."`

---

### DELETE /api/admins/:id

#### Success Cases
- `[ ]` **TC-ADM-018** — Delete a non-self, non-last admin  
  Expected: `200`, `"Admin deleted successfully."`

#### Business Rule Cases
- `[ ]` **TC-ADM-019** — Delete self  
  Use the `:id` of the currently logged-in admin  
  Expected: `400`, `"You cannot delete your own admin account."`

- `[ ]` **TC-ADM-020** — Delete last admin  
  Only one admin in the DB  
  Expected: `400`, `"Cannot delete the last admin. At least one admin must remain in the system."`

#### Authentication Cases
- `[ ]` **TC-ADM-021** — No token  
  Expected: `401`, `"Authentication token missing."`

- `[ ]` **TC-ADM-022** — Non-existent `:id`  
  Expected: `404`, `"Admin not found."`

---

## Students

### POST /api/students/bulk-create

#### Success Cases
- `[ ]` **TC-STU-001** — Valid single student, existing class  
  Expected: `201`, `inserted: 1`, `duplicates: 0`, `failed: 0`

- `[ ]` **TC-STU-002** — Mixed batch: 1 valid, 1 duplicate, 1 invalid class  
  Expected: `201`, `inserted: 1`, `duplicates: 1`, `failed: 1`, correct `duplicateRecords` and `failedRecords`

- `[ ]` **TC-STU-003** — Both HOSTELLER and DAYSCHOLAR types in one batch  
  Expected: `201`, both inserted

#### Validation Failures
- `[ ]` **TC-STU-004** — Missing `students` field  
  Request: `{}`  
  Expected: `400`, `"Students array is required"`

- `[ ]` **TC-STU-005** — `students` is not an array  
  Request: `{ "students": "bad" }`  
  Expected: `400`

- `[ ]` **TC-STU-006** — Invalid `studentType`  
  Record with `studentType: "UNKNOWN"`  
  Expected: `201`, that record in `failedRecords` with `"Invalid studentType"`

- `[ ]` **TC-STU-007** — Class does not exist for the provided dept/year/section  
  Expected: `201`, that record in `failedRecords` with `"Class not found for ..."`

#### Duplicate Cases
- `[ ]` **TC-STU-008** — Duplicate `rollno`  
  Second import of same rollno  
  Expected: `201`, that record in `duplicateRecords` with `"Roll number already exists"`

#### Authentication Cases
- `[ ]` **TC-STU-009** — No token  
  Expected: `401`, `"Authentication token missing."`

---

### GET /api/students

#### Success Cases
- `[ ]` **TC-STU-010** — Get all students (no filters)  
  Expected: `200`, array of students, `classId` populated, no passwords

- `[ ]` **TC-STU-011** — Filter by `rollno`  
  Expected: `200`, array with only matching student

- `[ ]` **TC-STU-012** — Filter by `department`  
  Expected: `200`, only students in that department

- `[ ]` **TC-STU-013** — Filter by `department + year + section`  
  Expected: `200`, only students in that class

- `[ ]` **TC-STU-014** — No matching students for filter  
  Expected: `200`, empty array `[]`

#### Authentication Cases
- `[ ]` **TC-STU-015** — No token  
  Expected: `401`, `"Authentication token missing."`

---

### PUT /api/students/:rollno

#### Success Cases
- `[ ]` **TC-STU-016** — Update `name` only  
  Expected: `200`, updated name, classId still populated

- `[ ]` **TC-STU-017** — Update `email` only  
  Expected: `200`, updated email

- `[ ]` **TC-STU-018** — Update `dateOfBirth` (password regeneration)  
  Expected: `200`, no password in response. Verify new password works on login.

- `[ ]` **TC-STU-019** — Update `department + year + section` (class reassignment)  
  Target class must exist  
  Expected: `200`, `classId` shows new class

- `[ ]` **TC-STU-020** — Partial class reassignment (update `section` only)  
  Expected: `200`, class resolved using existing dept/year + new section

#### Validation Failures
- `[ ]` **TC-STU-021** — Non-existent `rollno` in URL  
  Expected: `404`, `"Student with rollno '<rollno>' not found"`

- `[ ]` **TC-STU-022** — Class reassignment to non-existent class  
  Expected: `404`, `"Class not found for ..."`

#### Authentication Cases
- `[ ]` **TC-STU-023** — No token  
  Expected: `401`, `"Authentication token missing."`

---

### DELETE /api/students/:rollno

#### Success Cases
- `[ ]` **TC-STU-024** — Delete existing student  
  Expected: `200`, `"Student deleted successfully"`

#### Validation Failures
- `[ ]` **TC-STU-025** — Non-existent `rollno`  
  Expected: `404`, `"Student with rollno '<rollno>' not found"`

#### Authentication Cases
- `[ ]` **TC-STU-026** — No token  
  Expected: `401`, `"Authentication token missing."`

---

## Faculty

### POST /api/faculty/bulk-create

#### Success Cases
- `[ ]` **TC-FAC-001** — Valid STAFF faculty  
  Expected: `201`, `inserted: 1`

- `[ ]` **TC-FAC-002** — Valid HOD faculty with department  
  Expected: `201`, `inserted: 1`

- `[ ]` **TC-FAC-003** — Mixed batch: valid, duplicate staffId, duplicate email, TUTOR attempt, HOD without dept  
  Expected: `201`, correct counts and records for each category

#### Validation Failures
- `[ ]` **TC-FAC-004** — Missing `faculties` field  
  Request: `{}`  
  Expected: `400`, `"Faculties array is required."`

- `[ ]` **TC-FAC-005** — Empty `faculties` array  
  Request: `{ "faculties": [] }`  
  Expected: `400`, `"Faculties array cannot be empty."`

- `[ ]` **TC-FAC-006** — HOD without department  
  Record with `designation: "HOD"`, `department: ""`  
  Expected: `201`, that record in `failedRecords` with `"Department is mandatory when designation is HOD."`

- `[ ]` **TC-FAC-007** — Invalid designation  
  Record with `designation: "PRINCIPAL"` (typo)  
  Expected: `201`, that record in `failedRecords` with `"Invalid designation: ..."`

#### Business Rule Cases
- `[ ]` **TC-FAC-008** — TUTOR designation submitted directly  
  Record with `designation: "TUTOR"`  
  Expected: `201`, that record in `failedRecords` with `"TUTOR designation cannot be assigned directly..."`

#### Duplicate Cases
- `[ ]` **TC-FAC-009** — Duplicate `staffId`  
  Expected: `201`, that record in `duplicateRecords` with `"Staff ID already exists."`

- `[ ]` **TC-FAC-010** — Duplicate `email`  
  Expected: `201`, that record in `duplicateRecords` with `"Email '...' already exists."`

#### Authentication Cases
- `[ ]` **TC-FAC-011** — No token  
  Expected: `401`, `"Authentication token missing."`

---

### GET /api/faculty

#### Success Cases
- `[ ]` **TC-FAC-012** — Get all faculty (no filters)  
  Expected: `200`, array of faculty, no passwords

- `[ ]` **TC-FAC-013** — Filter by `staffId`  
  Expected: `200`, single match

- `[ ]` **TC-FAC-014** — Filter by `department`  
  Expected: `200`, only faculty in that department

- `[ ]` **TC-FAC-015** — Filter by `designation`  
  Expected: `200`, only faculty with that designation

- `[ ]` **TC-FAC-016** — No matches for filter  
  Expected: `200`, empty array `[]`

#### Authentication Cases
- `[ ]` **TC-FAC-017** — No token  
  Expected: `401`, `"Authentication token missing."`

---

### PUT /api/faculty/:staffId

#### Success Cases
- `[ ]` **TC-FAC-018** — Update `name` only  
  Expected: `200`, updated name returned

- `[ ]` **TC-FAC-019** — Update `email` to a unique address  
  Expected: `200`, updated email returned

- `[ ]` **TC-FAC-020** — Re-submit same `email` (no change)  
  Expected: `200` *(self-exclusion allows this)*

- `[ ]` **TC-FAC-021** — Update `designation` from STAFF to HOD (with department)  
  Expected: `200`, designation updated

- `[ ]` **TC-FAC-022** — Update `dateOfBirth` (password regeneration)  
  Expected: `200`, no password in response

- `[ ]` **TC-FAC-023** — Update `department` only  
  Expected: `200`, department updated

#### Validation Failures
- `[ ]` **TC-FAC-024** — Empty body  
  Request: `{}`  
  Expected: `400`, `"No valid fields provided for update."`

- `[ ]` **TC-FAC-025** — Email set to empty string  
  Expected: `400`, `"Email cannot be empty."`

- `[ ]` **TC-FAC-026** — HOD with no department (resulting state)  
  Request: faculty already HOD, update removes department  
  Expected: `400`, `"Department is mandatory when designation is HOD."`

- `[ ]` **TC-FAC-027** — HOD designation without providing department in update (faculty has no dept)  
  Expected: `400`, `"Department is mandatory when designation is HOD."`

- `[ ]` **TC-FAC-028** — Invalid designation value  
  Request: `{ "designation": "VICE_PRINCIPAL" }`  
  Expected: `400`, `"Invalid designation: '...' Allowed: STAFF, HOD, ADMIN, PRINCIPLE, SECURITY."`

#### Business Rule Cases
- `[ ]` **TC-FAC-029** — Submit `designation: "TUTOR"` via PUT  
  Expected: `400`, `"TUTOR designation cannot be assigned directly..."`

- `[ ]` **TC-FAC-030** — Attempt to change designation of a current TUTOR  
  Assign faculty as tutor first, then try to change designation via this endpoint  
  Expected: `400`, `"Cannot change designation of a faculty currently assigned as a class tutor. Remove the tutor assignment first."`

#### Duplicate Cases
- `[ ]` **TC-FAC-031** — Email already used by another faculty  
  Expected: `409`, `"A faculty with this email already exists."`

#### Authentication Cases
- `[ ]` **TC-FAC-032** — No token  
  Expected: `401`, `"Authentication token missing."`

- `[ ]` **TC-FAC-033** — Non-existent `staffId`  
  Expected: `404`, `"Faculty with staffId '<staffId>' not found."`

---

### DELETE /api/faculty/:staffId

#### Success Cases
- `[ ]` **TC-FAC-034** — Delete a STAFF faculty (not a tutor)  
  Expected: `200`, `"Faculty deleted successfully."`

#### Business Rule Cases
- `[ ]` **TC-FAC-035** — Delete a faculty currently assigned as class tutor  
  Assign faculty as tutor first  
  Expected: `400`, `"Faculty is currently assigned as a class tutor (<dept> <year> <section>)..."`

#### Authentication Cases
- `[ ]` **TC-FAC-036** — No token  
  Expected: `401`, `"Authentication token missing."`

- `[ ]` **TC-FAC-037** — Non-existent `staffId`  
  Expected: `404`, `"Faculty with staffId '<staffId>' not found."`

---

## Class

### POST /api/class

#### Success Cases
- `[ ]` **TC-CLS-001** — Valid class creation with STAFF tutor  
  Request: `{ "department": "CSE", "year": "2", "section": "A", "staffId": "FAC001" }`  
  Expected: `201`, class data returned, tutor designation shows `TUTOR`, faculty designation in DB updated to `TUTOR`

#### Validation Failures
- `[ ]` **TC-CLS-002** — Missing `department`  
  Expected: `400`, `"department, year, section, and staffId are all required."`

- `[ ]` **TC-CLS-003** — Missing `year`  
  Expected: `400`, same message

- `[ ]` **TC-CLS-004** — Missing `section`  
  Expected: `400`, same message

- `[ ]` **TC-CLS-005** — Missing `staffId`  
  Expected: `400`, same message

#### Duplicate Cases
- `[ ]` **TC-CLS-006** — Duplicate class (same dept + year + section)  
  Expected: `409`, `"Class CSE 2 A already exists."`

#### Business Rule Cases — Tutor Eligibility

- `[ ]` **TC-CLS-007** — `staffId` does not exist  
  Expected: `404`, `"Faculty with staffId '<staffId>' not found."`

- `[ ]` **TC-CLS-008** — Faculty designation is HOD  
  Expected: `400`, `"Faculty '<staffId>' has designation 'HOD'. Only STAFF faculty can be assigned as a class tutor."`

- `[ ]` **TC-CLS-009** — Faculty designation is ADMIN  
  Expected: `400`, `"Faculty '<staffId>' has designation 'ADMIN'. Only STAFF faculty can be assigned as a class tutor."`

- `[ ]` **TC-CLS-010** — Faculty designation is SECURITY  
  Expected: `400`, `"Faculty '<staffId>' has designation 'SECURITY'. Only STAFF faculty can be assigned as a class tutor."`

- `[ ]` **TC-CLS-011** — Faculty designation is PRINCIPLE  
  Expected: `400`, `"Faculty '<staffId>' has designation 'PRINCIPLE'. Only STAFF faculty can be assigned as a class tutor."`

- `[ ]` **TC-CLS-012** — Faculty already assigned as tutor in another class  
  Expected: `400`, `"Faculty '<staffId>' is already assigned as a class tutor in <dept> <year> <section>."`

#### Authentication Cases
- `[ ]` **TC-CLS-013** — No token  
  Expected: `401`, `"Authentication token missing."`

---

### GET /api/class

#### Success Cases
- `[ ]` **TC-CLS-014** — Get all classes (no filters)  
  Expected: `200`, array of classes, `tutors` populated, no raw ObjectIds

- `[ ]` **TC-CLS-015** — Filter by `department`  
  Expected: `200`, only classes in that department

- `[ ]` **TC-CLS-016** — Filter by `department + year + section`  
  Expected: `200`, single matching class

- `[ ]` **TC-CLS-017** — No matches for filter  
  Expected: `200`, empty array `[]`

#### Authentication Cases
- `[ ]` **TC-CLS-018** — No token  
  Expected: `401`, `"Authentication token missing."`

---

### PUT /api/class

#### Success Cases
- `[ ]` **TC-CLS-019** — Valid tutor reassignment (STAFF → TUTOR)  
  Steps: Create class with FAC001 → Reassign to FAC002  
  Expected: `200`, new tutor returned. FAC001 designation reverted to `STAFF`, FAC002 promoted to `TUTOR`

- `[ ]` **TC-CLS-020** — Self-reassignment (same tutor reassigned to same class)  
  Expected: `200`, no false conflict error

#### Validation Failures
- `[ ]` **TC-CLS-021** — Missing `department`  
  Expected: `400`, `"department, year, and section are required to identify the class."`

- `[ ]` **TC-CLS-022** — Missing `newStaffId`  
  Expected: `400`, `"newStaffId is required."`

- `[ ]` **TC-CLS-023** — Non-existent class  
  Expected: `404`, `"Class <dept> <year> <section> not found."`

#### Business Rule Cases
- `[ ]` **TC-CLS-024** — New tutor is HOD  
  Expected: `400`, designation-specific error message

- `[ ]` **TC-CLS-025** — New tutor is ADMIN  
  Expected: `400`, designation-specific error message

- `[ ]` **TC-CLS-026** — New tutor is SECURITY  
  Expected: `400`, designation-specific error message

- `[ ]` **TC-CLS-027** — New tutor already assigned to another class  
  Expected: `400`, `"Faculty '<staffId>' is already assigned as a tutor in <dept> <year> <section>."`

- `[ ]` **TC-CLS-028** — Validation failure on new tutor — verify old tutor is unchanged  
  Steps: Assign FAC001 → Try invalid reassignment → Confirm FAC001 still TUTOR in DB  
  Expected: `4xx` error, DB state unchanged

#### Authentication Cases
- `[ ]` **TC-CLS-029** — No token  
  Expected: `401`, `"Authentication token missing."`

---

### DELETE /api/class

#### Success Cases
- `[ ]` **TC-CLS-030** — Delete class with assigned tutor  
  Expected: `200`, `"Class deleted successfully."`. Tutor's designation reverted to `STAFF` in DB.

- `[ ]` **TC-CLS-031** — Delete class with no tutors (empty tutorIds)  
  Expected: `200`, no designation changes attempted

#### Validation Failures
- `[ ]` **TC-CLS-032** — Missing `department`  
  Expected: `400`, `"department, year, and section are required to identify the class."`

- `[ ]` **TC-CLS-033** — Missing `year`  
  Expected: `400`, same message

- `[ ]` **TC-CLS-034** — Missing `section`  
  Expected: `400`, same message

- `[ ]` **TC-CLS-035** — Non-existent class  
  Expected: `404`, `"Class <dept> <year> <section> not found."`

#### Authentication Cases
- `[ ]` **TC-CLS-036** — No token  
  Expected: `401`, `"Authentication token missing."`

---

## Cross-Module Integration Tests

These tests verify interactions between modules that depend on each other.

- `[ ]` **TC-INT-001** — Full lifecycle: Create Faculty → Create Class (assign tutor) → Verify designation is TUTOR  
  Expected: Faculty designation = `TUTOR` in DB

- `[ ]` **TC-INT-002** — Full lifecycle: Create Class → Import Students → Verify students linked to class  
  Expected: `GET /api/students` returns students with correct `classId`

- `[ ]` **TC-INT-003** — Attempt to delete a TUTOR faculty directly  
  Expected: `400`, tutor guard message. Faculty NOT deleted.

- `[ ]` **TC-INT-004** — Delete class → Verify tutor reverts to STAFF → Verify faculty can now be deleted  
  Expected: Class deleted, `GET /api/faculty?staffId=FAC001` shows `designation: STAFF`, then `DELETE /api/faculty/FAC001` returns 200.

- `[ ]` **TC-INT-005** — Delete class → Verify students assigned to it still exist (no cascade delete)  
  Expected: `GET /api/students` still returns students previously in that class

- `[ ]` **TC-INT-006** — Reassign tutor → Verify old tutor reverts to STAFF and new tutor becomes TUTOR  
  Expected: FAC001 → `STAFF`, FAC002 → `TUTOR`

- `[ ]` **TC-INT-007** — Update student class to a class that does not exist  
  Expected: `404`, `"Class not found for ..."`

---

## Postman Setup Notes

1. **Login step:** Run `POST /api/auth/login` first and ensure cookies are enabled in Postman.
2. **Cookie jar:** Postman stores the cookie automatically. All subsequent requests will use it.
3. **Logout step:** Run `POST /api/auth/logout` at the end of a session to clear the cookie.
4. **Testing expired token:** Manually alter the cookie value or wait for the 7-day expiry (or temporarily reduce `expiresIn` in `.env` for testing).
5. **MongoDB state:** Use MongoDB Compass or Atlas to verify designation changes after Class create/update/delete tests.

---

*Last updated: 2026-06-17*
