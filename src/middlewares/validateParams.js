import HttpStatus from 'http-status-codes';

export const validateParams = (req, res, next, schema) => {
  const { error } = schema.validate(req.params);

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
