export const parseArrayEntry = (entry) => (req, _, next) => {
  if (req.body[entry]) {
    req.body[entry] = JSON.parse(req.body[entry]);
  }
  next();
};
