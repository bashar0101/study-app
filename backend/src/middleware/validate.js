const { ZodError } = require('zod');
const ApiError = require('../utils/apiError');

const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    
    // Replace request properties with validated ones (handles defaults/stripping)
    if (parsed.body) req.body = parsed.body;
    if (parsed.query) req.query = parsed.query;
    if (parsed.params) req.params = parsed.params;
    
    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessage = error.errors.map((details) => `${details.path.join('.')}: ${details.message}`).join(', ');
      return next(new ApiError(400, errorMessage));
    }
    return next(error);
  }
};

module.exports = validate;
