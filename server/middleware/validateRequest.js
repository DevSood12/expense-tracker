import { ZodError } from 'zod';

/**
 * Generic validation middleware factory using Zod.
 * Usage: router.post('/register', validateRequest(registerSchema), authController.register)
 *
 * @param {import('zod').ZodSchema} schema - The Zod schema to validate against
 * @param {'body' | 'query' | 'params'} source - Which part of the request to validate (default: 'body')
 */
const validateRequest = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req[source]);
      // Replace with parsed data so downstream code gets coerced/defaulted values
      req[source] = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: formattedErrors,
        });
      }
      // Pass any non-Zod error to the centralized error handler
      next(error);
    }
  };
};

export default validateRequest;