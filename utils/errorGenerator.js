module.exports = (message = "Bad Request", code = 400) => {
  const error = new Error(message);
  error.statusCode = code;
  throw error;
};
