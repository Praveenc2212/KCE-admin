
# AI_CONTEXT.md - Read This First

This file gives the minimum project context needed for future AI work on the KCE Admin Portal backend.

## Project Purpose

KCE Admin Portal is a standalone backend for administrators to manage:

- Students
- Faculties
- Classes

It is separate from LeaveForm, but both systems share the same MongoDB Atlas database.

## Technical Stack

- Node.js
- Express
- MongoDB via Mongoose
- ES Modules
- JWT authentication
- bcrypt password hashing
- HTTP only cookies for auth

## Core Architecture

Request
→ Router
→ Controller
→ Service
→ Model
→ Database

Rules:
- Routes define endpoints only.
- Controllers read requests and send responses.
- Services contain business rules and database work.
- Models define schemas only.

## Shared Collection Rules

The following collections are shared with LeaveForm:

- Students
- Faculties
- Classes

Do not redesign them without approval.

## Student Rules

- Student uniqueness is based on `rollno`.
- Password comes from date of birth and must be stored hashed.
- Student must belong to an existing class.
- If class is missing, reject the record.
- Duplicate records must be skipped, not crash the import.

## Faculty Rules

- Faculty uniqueness is based on `staffId`.
- Password comes from date of birth and must be stored hashed.
- Faculty creation must not assign tutors.
- If designation is `HOD`, department is required.
- `staffId` must exist in the schema.

## Class Rules

- A class is unique by `department + year + section`.
- Class stores faculty references in `tutorIds`.
- When a faculty becomes a tutor, their designation changes to `TUTOR`.
- If a tutor is removed from all classes, designation returns to `STAFF`.
- Classes must not auto-create faculties.

## Error Handling Rules

- Use `AppError` for expected application errors.
- Use an async wrapper for controllers.
- Use a global error handler for final responses.

## Current Priority

Current work is focused on:
1. Authentication
2. Student CRUD
3. Faculty CRUD
4. Class CRUD

Leave management is out of scope for this project.