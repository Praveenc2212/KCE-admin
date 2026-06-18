/**
 * AppError - Custom operational error class.
 *
 * Usage:
 *   throw new AppError("Resource not found", 404);
 *
 * The global error handler distinguishes operational errors (AppError)
 * from unexpected programming errors to return appropriate responses.
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = true; // Flag: trusted, expected error

    // Capture stack trace, excluding AppError constructor frame
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
