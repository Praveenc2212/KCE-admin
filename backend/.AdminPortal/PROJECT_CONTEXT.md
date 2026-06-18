# KCE Admin Portal - PROJECT_CONTEXT.md

## Project Overview

KCE Admin Portal is a separate backend application used by administrators to manage:

- Students
- Faculties
- Classes

This project is independent from the LeaveForm project.

Both projects share the same MongoDB Atlas database.

Only administrative operations belong in this project.

---

# Technology Stack

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcrypt Password Hashing

Module System:

- ES Modules only

---

# Architecture Rules

Request
→ Router
→ Controller
→ Service
→ Model
→ Database

Rules:

- Controllers must not directly access Models.
- Controllers must call Services.
- Services contain business logic.
- Models contain schema definitions only.

---

# Authentication Rules

Authentication Method:

- JWT
- HTTP Only Cookies

Do not use localStorage authentication.

---

# Shared Database Rules

The following collections are shared with LeaveForm:

- Students
- Faculties
- Classes

These schemas already exist.

Do not redesign or modify schemas without approval.

Maintain compatibility with LeaveForm.

---

# Student Module

## Purpose

Manage student records.

## Input Fields

- rollno
- name
- gender
- email
- dateOfBirth
- department
- year
- section
- studentType

## Rules

- Password is generated from DOB and stored as a bcrypt hash.
- Student must belong to an existing class.
- If class does not exist, reject the student.
- Duplicate students are identified using rollno.
- Duplicate records should be skipped, not crash the import.

## Operations

- Bulk Create
- Get
- Update
- Delete

Update/Delete uses:

- rollno

---

# Faculty Module

## Purpose

Manage faculty records.

## Input Fields

- staffId
- name
- email
- dateOfBirth
- department
- designation

## Designations

- STAFF
- TUTOR
- HOD
- ADMIN
- PRINCIPLE
- SECURITY

## Rules

- Password is generated from DOB and stored as a bcrypt hash.
- Duplicate faculties are identified using staffId.
- Duplicate records should be skipped.
- Faculty creation must not assign tutors.
- Tutor assignment belongs only to the Class Module.
- If designation is HOD, department is mandatory.

## Faculty Schema Requirements

Faculty must contain:

- staffId (unique)

Reason:
Faculty CRUD and Class assignment use staffId.

## Operations

- Bulk Create
- Get
- Update
- Delete

Update/Delete uses:

- staffId

---

# Class Module

## Purpose

Manage classes and tutor assignments.

## Input Fields

- department
- year
- section
- staffIds

## Rules

- A class is uniquely identified by:
  - department
  - year
  - section

- staffIds must be converted to faculty references.
- Faculty assigned to a class become TUTORs.
- If a tutor is removed from all classes, designation must become STAFF.
- Class creation must not create new faculties automatically.

## Operations

- Create
- Get
- Update
- Delete

---

# Error Handling Rules

Use:

- Global Error Middleware
- AppError Utility
- Async Handler Utility

Do not duplicate try-catch logic across controllers.

---

# API Response Rules

Success:

```json
{
  "success": true,
  "message": "Operation completed",
  "data": {}
}
````

Failure:

```json
{
  "success": false,
  "message": "Reason for failure"
}
```

---

# Development Rules

1. Do not make assumptions.
2. Do not modify shared schemas without approval.
3. Do not auto-create classes.
4. Store only hashed passwords.
5. Follow Controller → Service → Model architecture.
6. If requirements are unclear, ask before implementing.
7. Read this file before every task.

---

# Current Scope

Included:

* Authentication
* Student CRUD
* Faculty CRUD
* Class CRUD

Excluded:

* Leave Management
* Barcode System
* Email Services
* Analytics
* Reports
* Dashboard Features
