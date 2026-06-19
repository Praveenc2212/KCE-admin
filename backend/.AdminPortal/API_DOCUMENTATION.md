# API Documentation — KCE Admin Portal Backend

**Base URL:** `http://localhost:<SERVER_PORT>/api`

**Authentication:** JWT stored in an HTTP-only cookie. All protected routes require a valid token set by `POST /api/auth/login`.

**Response Shape (all endpoints):**

Success:
```json
{
  "success": true,
  "message": "Human-readable message",
  "data": {}
}
```

Failure:
```json
{
  "success": false,
  "message": "Reason for failure"
}
```

---

## Table of Contents

1. [Authentication](#authentication)
2. [Admin](#admin)
3. [Students](#students)
4. [Faculty](#faculty)
5. [Class](#class)

---

## Authentication

### POST /api/auth/login

**Authentication Required:** No

**Description:** Authenticates an admin using email and password. On success, sets a signed HTTP-only JWT cookie used for all subsequent protected requests.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "secret123"
}
```

**Success Response — 200 OK:**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "email": "admin@example.com"
  }
}
```

**Cookie Set:**
```
Name:     <JWT_TOKEN_NAME>   (from .env)
HttpOnly: true
SameSite: Strict
Secure:   true  (false in development)
MaxAge:   7 days
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 401 | `"Invalid email or password."` |
| 500 | `"An unexpected error occurred. Please try again later."` |

**Business Rules:**
- Email is looked up in the Admin collection.
- Password is compared using `bcrypt.compare`.
- Both invalid email and wrong password return the same 401 to prevent user enumeration.
- Password is never returned in the response.

---

### POST /api/auth/logout

**Authentication Required:** No *(but intended for authenticated users)*

**Description:** Clears the authentication cookie, ending the admin session.

**Request Body:** None

**Success Response — 200 OK:**
```json
{
  "success": true,
  "message": "Logout successful."
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 500 | `"An unexpected error occurred. Please try again later."` |

**Business Rules:**
- Clears the cookie using the exact same options (`httpOnly`, `sameSite: strict`, `secure`) used when the cookie was set. A mismatch would cause the browser to silently ignore the clear.
- No database operation is performed.
- Works even if called without a valid token (idempotent).

---

### GET /api/auth/me

**Authentication Required:** Yes

**Description:** Returns the profile of the currently authenticated admin.

**Request Body:** None

**Query Parameters:** None

**URL Parameters:** None

**Success Response — 200 OK:**
```json
{
  "success": true,
  "message": "Authenticated admin retrieved.",
  "data": {
    "email": "admin@example.com"
  }
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 401 | `"Authentication token missing."` |
| 401 | `"Invalid or expired token."` |
| 401 | `"Admin not found."` |
| 500 | `"An unexpected error occurred. Please try again later."` |

**Business Rules:**
- Admin is identified by the `adminId` embedded in the JWT payload.
- Password is never returned.

---

## Admin

### POST /api/admins

**Authentication Required:** Yes

**Description:** Creates a new admin account.

**Request Body:**
```json
{
  "email": "newadmin@example.com",
  "password": "strongpassword"
}
```

**Success Response — 201 Created:**
```json
{
  "success": true,
  "message": "Admin created successfully.",
  "data": {
    "_id": "64abc123...",
    "email": "newadmin@example.com"
  }
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 401 | `"Authentication token missing."` |
| 409 | `"An admin with this email already exists."` |
| 500 | `"An unexpected error occurred. Please try again later."` |

**Business Rules:**
- Email must be unique across the Admin collection.
- Password is hashed with bcrypt (salt rounds: 12) before storage.
- Password is never returned in the response.

---

### GET /api/admins

**Authentication Required:** Yes

**Description:** Returns all admin accounts. Passwords are never included.

**Request Body:** None

**Query Parameters:** None

**URL Parameters:** None

**Success Response — 200 OK:**
```json
{
  "success": true,
  "message": "Admins retrieved successfully.",
  "data": [
    { "_id": "64abc123...", "email": "admin1@example.com" },
    { "_id": "64abc456...", "email": "admin2@example.com" }
  ]
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 401 | `"Authentication token missing."` |
| 500 | `"An unexpected error occurred. Please try again later."` |

**Business Rules:**
- `_id` and `email` only. Password and `__v` are excluded.

---

### PUT /api/admins/:id

**Authentication Required:** Yes

**Description:** Updates an admin's email, password, or both. MongoDB `_id` is used to identify the target admin.

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | MongoDB `_id` of the target admin |

**Request Body:** *(at least one field required)*
```json
{
  "email": "updated@example.com",
  "password": "newpassword"
}
```

**Success Response — 200 OK:**
```json
{
  "success": true,
  "message": "Admin updated successfully.",
  "data": {
    "_id": "64abc123...",
    "email": "updated@example.com"
  }
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 400 | `"Provide at least one field to update: email or password."` |
| 400 | `"Email cannot be empty."` |
| 400 | `"Password cannot be empty."` |
| 400 | `"No valid fields provided for update."` |
| 401 | `"Authentication token missing."` |
| 404 | `"Admin not found."` |
| 409 | `"An admin with this email already exists."` |
| 500 | `"An unexpected error occurred. Please try again later."` |

**Business Rules:**
- At least one of `email` or `password` must be provided.
- Email uniqueness is enforced, excluding the admin being updated (same email update is allowed).
- New password is bcrypt-hashed (salt rounds: 12) before storage.
- Password is never returned in the response.

---

### DELETE /api/admins/:id

**Authentication Required:** Yes

**Description:** Deletes an admin account by MongoDB `_id`.

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | MongoDB `_id` of the target admin |

**Request Body:** None

**Success Response — 200 OK:**
```json
{
  "success": true,
  "message": "Admin deleted successfully."
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 400 | `"You cannot delete your own admin account."` |
| 400 | `"Cannot delete the last admin. At least one admin must remain in the system."` |
| 401 | `"Authentication token missing."` |
| 404 | `"Admin not found."` |
| 500 | `"An unexpected error occurred. Please try again later."` |

**Business Rules:**
- **Self-deletion guard:** An admin cannot delete their own account.
- **Last-admin guard:** The system must always retain at least one admin. Deletion is blocked if only one admin remains.
- Self-deletion is checked before the last-admin check.

---

## Students

### POST /api/students/bulk-create

**Authentication Required:** Yes

**Description:** Bulk imports student records. Processes each record independently — duplicate and failed records are reported in the response without crashing the entire import.

**Request Body:**
```json
{
  "students": [
    {
      "rollno": "22CSE001",
      "name": "John Doe",
      "gender": "MALE",
      "email": "john@example.com",
      "dateOfBirth": "20/07/2003",
      "department": "CSE",
      "year": "2",
      "section": "A",
      "studentType": "HOSTELLER"
    }
  ]
}
```

**Field Reference:**

| Field | Type | Required | Allowed Values |
|-------|------|----------|----------------|
| `rollno` | string | Yes | Unique per student |
| `name` | string | Yes | — |
| `gender` | string | Yes | `"MALE"`, `"FEMALE"` |
| `email` | string | Yes | Unique per student |
| `dateOfBirth` | string | Yes | Format: `"DD/MM/YYYY"` |
| `department` | string | Yes | — |
| `year` | string | Yes | — |
| `section` | string | Yes | — |
| `studentType` | string | Yes | `"HOSTELLER"`, `"DAYSCHOLAR"` |

**Success Response — 201 Created:**
```json
{
  "success": true,
  "message": "Student import completed",
  "data": {
    "total": 3,
    "inserted": 1,
    "duplicates": 1,
    "failed": 1,
    "duplicateRecords": [
      { "rollno": "22CSE002", "reason": "Roll number already exists" }
    ],
    "failedRecords": [
      { "rollno": "22CSE003", "reason": "Class not found for CSE / 3 / B" }
    ]
  }
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 400 | `"Students array is required"` |
| 401 | `"Authentication token missing."` |
| 500 | `"An unexpected error occurred. Please try again later."` |

**Business Rules:**
- `students` must be a non-empty array.
- Each record is processed individually. Failures in one record do not affect others.
- **Duplicate detection:** `rollno` uniqueness is checked per record. Duplicates are skipped and counted.
- **Class resolution:** `department + year + section` is resolved to a class. If no matching class exists, the record is rejected.
- **Invalid `studentType`:** Records with values other than `HOSTELLER` or `DAYSCHOLAR` are rejected.
- **Password generation:** Password is derived from `dateOfBirth` — each date part is stripped of leading zeros and joined. Example: `"20/07/2003"` → `"2072003"`. The plain-text password is then bcrypt-hashed (salt rounds: 10).
- Password is never stored as plain text or returned in responses.

**Notes:**
- The `dateOfBirth` field is used only for password generation and is not stored.
- `classId` (MongoDB ObjectId) is stored internally; the class is exposed as populated fields in GET responses.

---

### GET /api/students

**Authentication Required:** Yes

**Description:** Returns all student records. Supports optional query filters. Tutor's class details are populated in the response.

**Request Body:** None

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `rollno` | string | No | Filter by exact roll number |
| `department` | string | No | Filter by class department |
| `year` | string | No | Filter by class year |
| `section` | string | No | Filter by class section |

*Query parameters can be combined.*

**Success Response — 200 OK:**
```json
{
  "success": true,
  "message": "Students retrieved successfully",
  "data": [
    {
      "_id": "64abc...",
      "name": "John Doe",
      "rollno": "22CSE001",
      "gender": "MALE",
      "email": "john@example.com",
      "studentType": "HOSTELLER",
      "classId": {
        "department": "CSE",
        "year": "2",
        "section": "A"
      }
    }
  ]
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 401 | `"Authentication token missing."` |
| 500 | `"An unexpected error occurred. Please try again later."` |

**Business Rules:**
- Password and `__v` are excluded from the response.
- Raw MongoDB ObjectIds are not exposed; `classId` is populated with `department`, `year`, and `section`.
- Class-level filters (`department`, `year`, `section`) resolve matching class IDs first, then filter students.

---

### PUT /api/students/:rollno

**Authentication Required:** Yes

**Description:** Updates a student record identified by roll number. Partial updates are supported — only provided fields are changed.

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `rollno` | string | Yes | Roll number of the student to update |

**Request Body:** *(at least one field)*
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "gender": "FEMALE",
  "studentType": "DAYSCHOLAR",
  "dateOfBirth": "15/03/2003",
  "department": "CSE",
  "year": "3",
  "section": "B"
}
```

**Success Response — 200 OK:**
```json
{
  "success": true,
  "message": "Student updated successfully",
  "data": {
    "_id": "64abc...",
    "name": "Jane Doe",
    "rollno": "22CSE001",
    "gender": "FEMALE",
    "email": "jane@example.com",
    "studentType": "DAYSCHOLAR",
    "classId": {
      "department": "CSE",
      "year": "3",
      "section": "B"
    }
  }
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 401 | `"Authentication token missing."` |
| 404 | `"Student with rollno '<rollno>' not found"` |
| 404 | `"Class not found for <dept> / <year> / <section>"` |
| 500 | `"An unexpected error occurred. Please try again later."` |

**Business Rules:**
- Student is identified by `rollno` in the URL parameter.
- If `department`, `year`, or `section` is provided, the new class is resolved using the updated fields merged with the current class values. Partial class reassignment is supported.
- If `dateOfBirth` is provided, a new password is generated using the DOB-to-password rule and re-hashed.
- Password is excluded from the response.

---

### DELETE /api/students/:rollno

**Authentication Required:** Yes

**Description:** Deletes a student record identified by roll number.

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `rollno` | string | Yes | Roll number of the student to delete |

**Request Body:** None

**Success Response — 200 OK:**
```json
{
  "success": true,
  "message": "Student deleted successfully"
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 401 | `"Authentication token missing."` |
| 404 | `"Student with rollno '<rollno>' not found"` |
| 500 | `"An unexpected error occurred. Please try again later."` |

**Business Rules:**
- Student is identified by `rollno`. If not found, a 404 is returned.
- No cascading effects on other collections.

---

## Faculty

### POST /api/faculty/bulk-create

**Authentication Required:** Yes

**Description:** Bulk imports faculty records. Processes each record independently. Duplicate and failed records are reported in the response without crashing the entire import.

**Request Body:**
```json
{
  "faculties": [
    {
      "staffId": "FAC001",
      "name": "Dr. Smith",
      "email": "smith@example.com",
      "dateOfBirth": "15/06/1985",
      "department": "CSE",
      "designation": "STAFF"
    }
  ]
}
```

**Field Reference:**

| Field | Type | Required | Allowed Values |
|-------|------|----------|----------------|
| `staffId` | string | Yes | Unique per faculty |
| `name` | string | Yes | — |
| `email` | string | Yes | Unique per faculty |
| `dateOfBirth` | string | Yes | Format: `"DD/MM/YYYY"` |
| `department` | string | Yes (mandatory if HOD) | — |
| `designation` | string | Yes | `"STAFF"`, `"HOD"`, `"ADMIN"`, `"PRINCIPLE"`, `"SECURITY"` |

**Success Response — 201 Created:**
```json
{
  "success": true,
  "message": "Faculty import completed.",
  "data": {
    "total": 3,
    "inserted": 1,
    "duplicates": 1,
    "failed": 1,
    "duplicateRecords": [
      { "staffId": "FAC002", "reason": "Staff ID already exists." }
    ],
    "failedRecords": [
      { "staffId": "FAC003", "reason": "TUTOR designation cannot be assigned directly. Create a class assignment instead." }
    ]
  }
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 400 | `"Faculties array is required."` |
| 400 | `"Faculties array cannot be empty."` |
| 401 | `"Authentication token missing."` |
| 500 | `"An unexpected error occurred. Please try again later."` |

**Business Rules:**
- `faculties` must be a non-empty array.
- Each record is processed individually.
- **TUTOR designation is rejected:** Only the Class Module may assign the TUTOR designation. Submitting `"TUTOR"` causes the record to fail with an explanatory message.
- **Designation validation:** Allowed values are `STAFF`, `HOD`, `ADMIN`, `PRINCIPLE`, `SECURITY`. Any other value fails the record.
- **HOD requires department:** If designation is `HOD` and `department` is empty, the record fails.
- **Duplicate `staffId`:** Record is skipped and counted as a duplicate.
- **Duplicate `email`:** Record is skipped and counted as a duplicate.
- **Password generation:** Same rule as students — DOB parts stripped of leading zeros, joined, then bcrypt-hashed (salt rounds: 10).
- Password is never stored as plain text or returned.

---

### GET /api/faculty

**Authentication Required:** Yes

**Description:** Returns all faculty records. Supports optional query filters.

**Request Body:** None

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `staffId` | string | No | Filter by exact staff ID |
| `department` | string | No | Filter by department |
| `designation` | string | No | Filter by designation |

*Query parameters can be combined.*

**Success Response — 200 OK:**
```json
{
  "success": true,
  "message": "Faculties retrieved successfully.",
  "data": [
    {
      "staffId": "FAC001",
      "name": "Dr. Smith",
      "email": "smith@example.com",
      "department": "CSE",
      "designation": "STAFF"
    }
  ]
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 401 | `"Authentication token missing."` |
| 500 | `"An unexpected error occurred. Please try again later."` |

**Business Rules:**
- Password and `__v` are excluded from all responses.

---

### PUT /api/faculty/:staffId

**Authentication Required:** Yes

**Description:** Updates a faculty record identified by staff ID. Partial updates are supported.

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `staffId` | string | Yes | Staff ID of the faculty to update |

**Request Body:** *(at least one field)*
```json
{
  "name": "Prof. Smith",
  "email": "prof.smith@example.com",
  "department": "IT",
  "designation": "HOD",
  "dateOfBirth": "20/06/1980"
}
```

**Success Response — 200 OK:**
```json
{
  "success": true,
  "message": "Faculty updated successfully.",
  "data": {
    "staffId": "FAC001",
    "name": "Prof. Smith",
    "email": "prof.smith@example.com",
    "department": "IT",
    "designation": "HOD"
  }
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 400 | `"No valid fields provided for update."` |
| 400 | `"Email cannot be empty."` |
| 400 | `"TUTOR designation cannot be assigned directly. Create a class assignment instead."` |
| 400 | `"Invalid designation: '<value>'. Allowed: STAFF, HOD, ADMIN, PRINCIPLE, SECURITY."` |
| 400 | `"Cannot change designation of a faculty currently assigned as a class tutor. Remove the tutor assignment first."` |
| 400 | `"Department is mandatory when designation is HOD."` |
| 401 | `"Authentication token missing."` |
| 404 | `"Faculty with staffId '<staffId>' not found."` |
| 409 | `"A faculty with this email already exists."` |
| 500 | `"An unexpected error occurred. Please try again later."` |

**Business Rules:**
- Faculty is identified by `staffId` in the URL parameter.
- **TUTOR designation is always rejected** from the API.
- **Designation change blocked if currently a tutor:** If the faculty's current designation is `TUTOR`, designation cannot be changed via this endpoint — the class assignment must be removed first via the Class Module.
- **Email uniqueness:** Checked excluding the current faculty (same-email re-submission is allowed).
- **HOD cross-field rule:** The *resulting* designation and *resulting* department are evaluated. If the final state would be `HOD` with no department, the request is rejected.
- If `dateOfBirth` is provided, a new password is generated and re-hashed.
- Password is excluded from the response.

---

### DELETE /api/faculty/:staffId

**Authentication Required:** Yes

**Description:** Deletes a faculty record identified by staff ID.

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `staffId` | string | Yes | Staff ID of the faculty to delete |

**Request Body:** None

**Success Response — 200 OK:**
```json
{
  "success": true,
  "message": "Faculty deleted successfully."
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 400 | `"Faculty is currently assigned as a class tutor (<dept> <year> <section>). Remove the tutor assignment before deleting this faculty."` |
| 401 | `"Authentication token missing."` |
| 404 | `"Faculty with staffId '<staffId>' not found."` |
| 500 | `"An unexpected error occurred. Please try again later."` |

**Business Rules:**
- **Tutor guard:** Deletion is blocked if the faculty appears in any class's `tutorIds` array. The error message includes the class identity.
- The class tutor assignment must be removed via the Class Module before this faculty can be deleted.

---

## Class

### POST /api/class

**Authentication Required:** Yes

**Description:** Creates a new class and assigns a tutor to it. The assigned faculty's designation is promoted from `STAFF` to `TUTOR`.

**Request Body:**
```json
{
  "department": "CSE",
  "year": "2",
  "section": "A",
  "staffId": "FAC001"
}
```

**Field Reference:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `department` | string | Yes | Class department |
| `year` | string | Yes | Class year |
| `section` | string | Yes | Class section |
| `staffId` | string | Yes | Staff ID of the faculty to assign as tutor |

**Success Response — 201 Created:**
```json
{
  "success": true,
  "message": "Class created successfully.",
  "data": {
    "department": "CSE",
    "year": "2",
    "section": "A",
    "tutor": {
      "staffId": "FAC001",
      "name": "Dr. Smith",
      "email": "smith@example.com",
      "department": "CSE",
      "designation": "TUTOR"
    }
  }
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 400 | `"department, year, section, and staffId are all required."` |
| 400 | `"Faculty '<staffId>' is already assigned as a class tutor. A faculty can only be tutor of one class at a time."` |
| 400 | `"Faculty '<staffId>' has designation '<designation>'. Only STAFF faculty can be assigned as a class tutor."` |
| 401 | `"Authentication token missing."` |
| 404 | `"Faculty with staffId '<staffId>' not found."` |
| 409 | `"Class <dept> <year> <section> already exists."` |
| 500 | `"An unexpected error occurred. Please try again later."` |

**Business Rules:**
- **Class uniqueness:** `department + year + section` must be unique across all classes.
- **Tutor eligibility rules** (all enforced atomically):
  - The faculty must exist.
  - Faculty designation must be exactly `STAFF`. Any other designation is rejected.
  - Faculty must not already appear in another class's `tutorIds`.
- On success, faculty designation is updated from `STAFF` → `TUTOR`.
- Raw MongoDB ObjectIds are never exposed in the response.

---

### GET /api/class

**Authentication Required:** Yes

**Description:** Returns all class records with populated tutor details. Supports optional query filters.

**Request Body:** None

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `department` | string | No | Filter by department |
| `year` | string | No | Filter by year |
| `section` | string | No | Filter by section |

*Query parameters can be combined.*

**Success Response — 200 OK:**
```json
{
  "success": true,
  "message": "Classes retrieved successfully.",
  "data": [
    {
      "department": "CSE",
      "year": "2",
      "section": "A",
      "tutors": [
        {
          "staffId": "FAC001",
          "name": "Dr. Smith",
          "email": "smith@example.com",
          "department": "CSE",
          "designation": "TUTOR"
        }
      ]
    }
  ]
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 401 | `"Authentication token missing."` |
| 500 | `"An unexpected error occurred. Please try again later."` |

**Business Rules:**
- `tutorIds` is populated with faculty details (`staffId`, `name`, `email`, `department`, `designation`).
- Raw MongoDB ObjectIds are never exposed.
- `__v` is excluded.

---

### PUT /api/class

**Authentication Required:** Yes

**Description:** Reassigns the tutor of an existing class. The class is identified by `department + year + section` in the request body (no URL parameter). The old tutor's designation reverts to `STAFF`, and the new tutor's designation is promoted to `TUTOR`.

**Request Body:**
```json
{
  "department": "CSE",
  "year": "2",
  "section": "A",
  "newStaffId": "FAC002"
}
```

**Field Reference:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `department` | string | Yes | Department of the class to update |
| `year` | string | Yes | Year of the class to update |
| `section` | string | Yes | Section of the class to update |
| `newStaffId` | string | Yes | Staff ID of the new tutor |

**Success Response — 200 OK:**
```json
{
  "success": true,
  "message": "Class tutor updated successfully.",
  "data": {
    "department": "CSE",
    "year": "2",
    "section": "A",
    "newTutor": {
      "staffId": "FAC002",
      "name": "Prof. Jones",
      "email": "jones@example.com",
      "department": "CSE",
      "designation": "TUTOR"
    }
  }
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 400 | `"department, year, and section are required to identify the class."` |
| 400 | `"newStaffId is required."` |
| 400 | `"Faculty '<staffId>' is already assigned as a class tutor. A faculty can only be tutor of one class at a time."` |
| 400 | `"Faculty '<staffId>' has designation '<designation>'. Only STAFF faculty can be assigned as a class tutor."` |
| 401 | `"Authentication token missing."` |
| 404 | `"Class <dept> <year> <section> not found."` |
| 404 | `"Faculty with staffId '<staffId>' not found."` |
| 500 | `"An unexpected error occurred. Please try again later."` |

**Business Rules:**
- **Safe execution order:** The new tutor is fully validated *before* any state changes are made. If validation fails, the old tutor remains assigned and no data is corrupted.
- **Old tutor reversion:** All faculty currently in `tutorIds` have their designation reverted to `STAFF`.
- **Self-reassignment:** Reassigning the same tutor to the same class is allowed — the `excludeClassId` mechanism prevents a false "already assigned" conflict.
- **Tutor eligibility rules** are the same as `POST /api/class`.

---

### DELETE /api/class

**Authentication Required:** Yes

**Description:** Deletes a class. The class is identified by `department + year + section` in the request body (no URL parameter). All assigned tutors have their designation reverted to `STAFF` before the class is deleted.

**Request Body:**
```json
{
  "department": "CSE",
  "year": "2",
  "section": "A"
}
```

**Field Reference:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `department` | string | Yes | Department of the class to delete |
| `year` | string | Yes | Year of the class to delete |
| `section` | string | Yes | Section of the class to delete |

**Success Response — 200 OK:**
```json
{
  "success": true,
  "message": "Class deleted successfully."
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 400 | `"department, year, and section are required to identify the class."` |
| 401 | `"Authentication token missing."` |
| 404 | `"Class <dept> <year> <section> not found."` |
| 500 | `"An unexpected error occurred. Please try again later."` |

**Business Rules:**
- Before deletion, all faculty in `tutorIds` whose designation is `TUTOR` are reverted to `STAFF`.
- The class document is then removed from the database.
- Students assigned to this class are **not** automatically reassigned or deleted — orphaned `classId` references may exist in the Student collection.

---

## Global Error Reference

### Authentication Errors (all protected routes)

| Status | Message | Cause |
|--------|---------|-------|
| 401 | `"Authentication token missing."` | No cookie present |
| 401 | `"Invalid or expired token."` | Cookie present but JWT verification failed |
| 401 | `"Admin not found."` | Token valid but admin no longer exists in DB |
| 500 | `"Internal server error."` | Unexpected error inside auth middleware |

### Unexpected Server Errors (all routes)

| Status | Message | Cause |
|--------|---------|-------|
| 500 | `"An unexpected error occurred. Please try again later."` | Unhandled exception caught by global error handler |

### 404 Route Not Found

| Status | Message | Cause |
|--------|---------|-------|
| 404 | `"Route not found: <METHOD> <path>"` | No matching route registered |

---

## Password Generation Algorithm

Used for both students and faculty:

```
Input:  "20/07/2003"
Steps:  Split by "/"  → ["20", "07", "2003"]
        Strip leading zeros per part → ["20", "7", "2003"]
        Join → "2072003"
Output: "2072003"  (plain text, then bcrypt-hashed before storage)
```

**Admin passwords:** Raw user-supplied string, bcrypt-hashed (salt rounds: 12).  
**Student/Faculty passwords:** DOB-derived string, bcrypt-hashed (salt rounds: 10).

---

*Last updated: 2026-06-17*
