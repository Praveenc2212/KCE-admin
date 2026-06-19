# Architecture Overview - KCE Admin Portal Backend

This document defines the software design, directory layout, and request lifecycle of the Admin Portal backend.

## Directory Structure

```text
backend/
├── server/
│   ├── connections/      # Database connections (Mongoose)
│   ├── controllers/      # Route controllers (parse requests, format responses)
│   ├── Middleware/       # Middlewares (auth check, error handling)
│   ├── models/           # Mongoose schemas and database models
│   ├── routers/          # Express route definitions
│   ├── services/         # Business logic and database operations
│   └── utils/            # Shared utility functions (JWT, errors, helpers)
├── .AdminPortal/         # Project documentation for AI and developers
├── .env                  # Local environment variables
├── .gitignore            # Git ignore rules
├── index.js              # Application entry point
├── package.json          # Dependencies and scripts
└── nodemon.json          # Nodemon watcher config
````

---

## Layer Responsibilities

### 1. Routing Layer (`server/routers/`)

* Defines API endpoints.
* Applies middleware where needed.
* Sends requests to controllers.

Routes must not contain database queries or business logic.

### 2. Controller Layer (`server/controllers/`)

* Reads `req.body`, `req.query`, and `req.params`.
* Calls the service layer.
* Sends HTTP responses.

Controllers must not:

* access models directly
* contain database logic
* contain password generation or hashing logic
* contain duplicate checking logic

### 3. Service Layer (`server/services/`)

* Contains business rules.
* Performs database operations.
* Handles transformations, duplicate checks, and mappings.

Services may access models directly.

### 4. Model Layer (`server/models/`)

* Defines Mongoose schema structure.
* Defines indexes and references.
* Maps to MongoDB collections.

Models must not contain request-handling logic.

---

## Request Lifecycle Flow

```text
Client HTTP Request
        ↓
Express Router
        ↓
Middleware (if needed)
        ↓
Controller Handler
        ↓
Service Business Logic
        ↓
Mongoose DB Operation
        ↓
Client HTTP Response
```

---

## Standard Response Shape

Success:

```json
{
  "success": true,
  "message": "Operation successful",
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

## Error Handling Rule

* Controllers should use an async wrapper.
* Services should throw `AppError`.
* A global error middleware must send the final response.

---

## Design Priority

1. Keep controllers thin.
2. Put business logic in services.
3. Keep models focused on schema only.
4. Keep the code compatible with the shared database used by LeaveForm.