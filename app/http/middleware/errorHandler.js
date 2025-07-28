// General error handler
function handler(err, req, res, next) {
  // Set status code (default to 500)
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Internal Server Error",
    status,
  });
}

// 404 error handler
function error404(req, res, next) {
  res.status(404).json({
    error: "Not Found",
    status: 404,
  });
}

export default {
  handler,
  error404,
};
