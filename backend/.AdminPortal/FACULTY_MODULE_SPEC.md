# FACULTY_MODULE_SPEC.md

## Module Purpose

The Faculty Module is responsible for:

* Bulk creating faculty records
* Retrieving faculty records
* Updating faculty records
* Deleting faculty records

This module manages faculty information only.

Tutor assignment is NOT handled by this module.

Tutor assignment belongs exclusively to the Class Module.

---

# Faculty Identity

Faculty are uniquely identified by:

```text
staffId
```

Examples:

```text
C1666
C1777
C1888
```

All updates, retrievals, and deletions should use `staffId`.

Never expose MongoDB ObjectIds in public APIs.

---

# Faculty Fields

## Input Fields

```json
{
    "staffId": "C1666",
    "name": "Faculty Name",
    "email": "faculty@kce.ac.in",
    "dateOfBirth": "20/07/2005",
    "department": "CSE",
    "designation": "STAFF"
}
```

---

## Required Fields

* staffId
* name
* email
* dateOfBirth
* designation

---

## Optional Fields

* department

Department becomes mandatory only when designation is HOD.

---

# Designations

Allowed values:

```text
STAFF
TUTOR
HOD
ADMIN
PRINCIPLE
SECURITY
```

Any other value is invalid.

---

# Endpoint 1 - Bulk Create Faculty

## Route

POST `/api/faculties/bulk-create`

---

## Request Body

```json
{
    "faculties": [
        {
            "staffId": "C1666",
            "name": "Faculty Name",
            "email": "faculty@kce.ac.in",
            "dateOfBirth": "20/07/2005",
            "department": "CSE",
            "designation": "STAFF"
        }
    ]
}
```

---

## Business Rules

### Duplicate Rule

Faculty uniqueness is based on:

```text
staffId
```

If faculty already exists:

* Skip record
* Continue processing remaining records

Do not stop the import.

---

### Password Rule

Convert:

```text
20/07/2005
```

Into:

```text
2072005
```

Rules:

* Remove '/'
* Remove leading zeros

Then:

```text
bcrypt hash
```

Store only hashed password.

Never store plain text passwords.

---

### HOD Rule

If designation is:

```text
HOD
```

Then:

```text
department
```

is mandatory.

If department is missing:

* Mark record as failed
* Continue processing remaining records

---

### Tutor Rule

Faculty creation must never:

* assign tutors
* create class mappings
* update class records

Tutor assignment belongs to Class Module.

---

## Response Format

```json
{
    "success": true,
    "message": "Faculty import completed",
    "data": {
        "total": 100,
        "inserted": 90,
        "duplicates": 5,
        "failed": 5,
        "duplicateRecords": [],
        "failedRecords": []
    }
}
```

---

# Endpoint 2 - Get Faculties

## Route

GET `/api/faculties`

---

## Get All

```http
GET /api/faculties
```

---

## Get By Staff ID

```http
GET /api/faculties?staffId=C1666
```

---

## Filter By Department

```http
GET /api/faculties?department=CSE
```

---

## Filter By Designation

```http
GET /api/faculties?designation=STAFF
```

---

## Combined Filters

```http
GET /api/faculties?department=CSE&designation=STAFF
```

---

## Response Example

```json
{
    "staffId": "C1666",
    "name": "Faculty Name",
    "email": "faculty@kce.ac.in",
    "department": "CSE",
    "designation": "STAFF"
}
```

Do not return password fields.

---

# Endpoint 3 - Update Faculty

## Route

PUT `/api/faculties/:staffId`

---

## Faculty Identifier

```text
staffId
```

---

## Allowed Updates

```text
name
email
department
designation
```

---

## HOD Validation

If designation becomes:

```text
HOD
```

Then department is mandatory.

---

## Tutor Restriction

Faculty update must not:

```text
Assign tutors
Remove tutors
Update class tutor mappings
```

Class Module controls tutor assignments.

---

## Success Response

```json
{
    "success": true,
    "message": "Faculty updated successfully"
}
```

---

# Endpoint 4 - Delete Faculty

## Route

DELETE `/api/faculties/:staffId`

---

## Faculty Identifier

```text
staffId
```

---

## Business Rules

If faculty does not exist:

Return 404.

---

### Tutor Safety Rule

If faculty is currently assigned as a tutor in any class:

Do not delete.

Return error.

Example:

```json
{
    "success": false,
    "message": "Faculty is assigned to one or more classes"
}
```

The class must be updated first before deletion.

---

## Success Response

```json
{
    "success": true,
    "message": "Faculty deleted successfully"
}
```

---

# Controller Responsibilities

Controllers are responsible for:

* Reading request body
* Reading route parameters
* Reading query parameters
* Calling service functions
* Sending responses

Controllers must NOT:

* Query models
* Generate passwords
* Hash passwords
* Check duplicates
* Check tutor assignments

---

# Service Responsibilities

Services are responsible for:

* Faculty queries
* Duplicate checks
* Password generation
* Password hashing
* Import processing
* HOD validation
* Tutor assignment safety checks
* Database operations

Services may access models directly.

---

# Service Contracts

```js
bulkCreateFaculties(faculties)

getFaculties(filters)

updateFacultyByStaffId(
    staffId,
    updateData
)

deleteFacultyByStaffId(
    staffId
)
```

Controllers should only call these service functions.

---

# Error Handling

Use:

* AppError
* asyncHandler
* Global Error Middleware

Do not duplicate try-catch blocks.

---

# Important Rules

1. Faculty uniqueness = staffId.
2. Passwords must always be hashed.
3. HOD requires department.
4. Faculty Module must never assign tutors.
5. Tutor assignment belongs only to Class Module.
6. Faculty assigned to classes cannot be deleted.
7. No MongoDB ObjectIds in public APIs.
8. Follow Route → Controller → Service → Model architecture.
