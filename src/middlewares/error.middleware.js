const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.statusCode ? err.message : 'Internal server error';

  if (statusCode === 500) console.error(err); // log real bugs, hide details from client

  res.status(statusCode).json({ error: message });
};

export default errorMiddleware;