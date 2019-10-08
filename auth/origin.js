module.exports = (req, res, next) => {
  if (req.headers.origin !== process.env.FRONTEND_URL) {
    console.error('Request blocked due to incorrect origin: ');
    console.error(req.headers.origin, ' vs. ', process.env.FRONTEND_URL);
    return res.status(401).json({ message: 'You are not authorized.  CORS.' });
  }
  next();
};
