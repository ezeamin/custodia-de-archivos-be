import HttpStatus from 'http-status-codes';

export const validateQuery = (req, res, next, schema) => {
  const { error } = schema.validate(req.query);

  if (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      data: null,
      message: error.details[0].message,
    });
    return;
  }

  // No errors, continue with the request
  next();
};
