export const parseArrayEntry = (entry) => (req, res, next) => {
  if (req.body[entry]) {
    req.body[entry] = JSON.parse(req.body[entry]);
  }
  next();
};
