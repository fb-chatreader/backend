module.exports = (err, req, res) => {
  const statusCode = err.statusCode || 500;
  const env = process.env.DB_ENVIRONMENT || 'development';
  let error;
  if (env === 'development' && statusCode > 499) {
    console.error(err);
    error = `Error during ${req.method} at ${req.path}: ${err.message}`;
  }

  if (env === 'production') {
    error = 'An error occurred while processing your request.';
  }
  return res.status(statusCode).json({ error });
};
