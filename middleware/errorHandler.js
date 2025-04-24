const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;

  res.status(statusCode).json({
    error: {
      status: statusCode,
      message: err.message || "Внутрішня помилка сервера",
    },
  });
};

module.exports = errorHandler;
