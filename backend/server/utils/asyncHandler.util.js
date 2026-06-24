/**
 * asyncHandler - Wraps an async Express route handler.
 *
 * Eliminates the need for repetitive try-catch blocks in every controller.
 * Any thrown error (AppError or unexpected) is forwarded to Express's
 * next(err), which routes it to the global error handler middleware.
 *
 * Usage:
 *   router.get("/", asyncHandler(myController));
 *
 * @param {Function} fn - Async controller function (req, res, next)
 * @returns {Function} Express middleware
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
