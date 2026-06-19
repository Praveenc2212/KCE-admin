# CLASS_MODULE_SPEC.md

## Module Purpose

The Class Module is responsible for:

* Creating classes
* Managing tutor assignments
* Updating tutor assignments
* Deleting classes
* Maintaining Faculty ↔ Tutor relationships

The Class Module is the only module allowed to assign or remove the `TUTOR` designation.

Faculty creation must never assign tutors.

---

# Class Identity

A class is uniquely identified by:

* department
* year
* section

Example:

```text
CSE + III + A
```

Only one class can exist for a given combination.

---

# Data Structure

## Input

```json
{
    "department": "CSE",
    "year": "III",
    "section": "A",
    "staffIds": [
        "C1666",
        "C1777"
    ]
}
```

---

## Database Structure

Class stores:

```js
{
    department,
    year,
    section,
    tutorIds: [Faculty ObjectIds]
}
```

The API receives `staffIds`.

The service converts them into Faculty references.

---

# Endpoint 1 - Create Class

## Route

POST `/api/classes`

---

## Request Body

```json
{
    "department": "CSE",
    "year": "III",
    "section": "A",
    "staffIds": [
        "C1666",
        "C1777"
    ]
}
```

---

## Validation Rules

Required:

* department
* year
* section

Optional:

* staffIds

A class may be created without tutors.

---

## Business Rules

### Duplicate Rule

Before creation:

Check if class already exists using:

```text
department
year
section
```

If already exists:

Return error.

Do not create duplicate class.

---

### Tutor Mapping Rule

For every staffId:

```text
staffId
    ↓
Faculty
    ↓
Faculty ObjectId
    ↓
tutorIds
```

---

### Invalid Faculty Rule

If a staffId does not exist:

Return error.

Do not create class.

---

### Tutor Designation Rule

When a faculty is assigned to a class:

```text
STAFF
↓
TUTOR
```

Update Faculty designation.

---

## Success Response

```json
{
    "success": true,
    "message": "Class created successfully",
    "data": {}
}
```

---

# Endpoint 2 - Get Classes

## Route

GET `/api/classes`

````

### Get All

```http
GET /api/classes
````

---

### Filter By Department

```http
GET /api/classes?department=CSE
```

---

### Filter By Year

```http
GET /api/classes?year=III
```

---

### Filter By Section

```http
GET /api/classes?section=A
```

---

### Combined Filters

```http
GET /api/classes?department=CSE&year=III&section=A
```

---

## Response Rules

Populate tutor information.

Return:

```json
{
    "department": "CSE",
    "year": "III",
    "section": "A",
    "tutors": [
        {
            "staffId": "C1666",
            "name": "Faculty Name"
        }
    ]
}
```

Do not return only ObjectIds.

---

# Endpoint 3 - Update Class

## Route

PUT `/api/classes`

---

## Identification

Class is identified using:

```json
{
    "department": "CSE",
    "year": "III",
    "section": "A"
}
```

Never use MongoDB ObjectId in APIs.

---

## Request Body

```json
{
    "department": "CSE",
    "year": "III",
    "section": "A",
    "staffIds": [
        "C1666",
        "C1888"
    ]
}
```

---

## Business Rules

### Tutor Reassignment

Compare:

```text
Old Tutors
vs
New Tutors
```

Find:

```text
Removed Tutors
Added Tutors
```

---

### Added Tutor Rule

For every newly added tutor:

```text
designation
↓
TUTOR
```

---

### Removed Tutor Rule

For every removed tutor:

Check all classes.

If tutor still exists in another class:

```text
Keep TUTOR
```

Else:

```text
Change designation to STAFF
```

---

### Invalid Faculty Rule

If any supplied staffId does not exist:

Return error.

Do not update class.

---

## Success Response

```json
{
    "success": true,
    "message": "Class updated successfully"
}
```

---

# Endpoint 4 - Delete Class

## Route

DELETE `/api/classes`

---

## Request Body

```json
{
    "department": "CSE",
    "year": "III",
    "section": "A"
}
```

---

## Business Rules

### Before Deletion

Fetch:

```text
Current Tutors
```

---

### Delete Class

Remove class document.

---

### Tutor Cleanup Rule

For every tutor previously assigned:

Check all remaining classes.

If still assigned elsewhere:

```text
Keep TUTOR
```

Else:

```text
Change designation to STAFF
```

---

## Success Response

```json
{
    "success": true,
    "message": "Class deleted successfully"
}
```

---

# Controller Responsibilities

Controllers are responsible for:

* Reading request body
* Reading query parameters
* Calling services
* Returning responses

Controllers must NOT:

* Query models
* Update faculty designations
* Perform tutor mapping
* Access MongoDB directly

---

# Service Responsibilities

Services are responsible for:

* Class queries
* Class creation
* Tutor mapping
* Tutor designation updates
* Tutor cleanup
* Duplicate checks
* Validation of staffIds

Services may access models directly.

---

# Service Contracts

```js
createClass(data)

getClasses(filters)

updateClass(data)

deleteClass(data)
```

Controllers should only call these functions.

---

# Error Handling

Use:

* AppError
* asyncHandler
* Global Error Middleware

Do not duplicate try-catch blocks.

---

# Important Rules

1. Class uniqueness = department + year + section.
2. Class Module owns tutor assignment.
3. Faculty Module must never assign tutors.
4. Student Module must never assign tutors.
5. Invalid staffIds must fail the operation.
6. No MongoDB ObjectIds in public APIs.
7. Keep Faculty designation synchronized with tutor assignments.
