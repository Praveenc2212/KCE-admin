import AppError from "../utils/AppError.util.js";

/**
 * Global Error Handler Middleware
 *
 * Must be registered LAST in index.js after all routes:
 *   app.use(errorHandler);
 *
 * Handles two categories of errors:
 *   1. Operational (AppError) – known, expected errors thrown intentionally.
 *      Returns the developer-specified statusCode and message.
 *
 *   2. Unexpected – programming bugs, third-party failures, etc.
 *      Returns 500 with a generic message to avoid leaking internals.
 *
 * Response shape (failure):
 *   { "success": false, "message": "..." }
 */
const errorHandler = (err, req, res, next) => {
  // Operational error: we trust the message and status code
  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Unexpected error: log internally, return generic response
  console.error("Unhandled Error:", err);

  return res.status(500).json({
    success: false,
    message: "An unexpected error occurred. Please try again later.",
  });
};

export default errorHandler;
