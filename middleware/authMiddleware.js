const authMiddleware = (req, res, next) => {
  const authToken = req.headers["auth-token"];

  if (!authToken || authToken !== "oleg-token-123") {
    return res.status(401).json({
      error: {
        status: 401,
        message: "Необхідна авторизація",
      },
    });
  }

  next();
};

module.exports = authMiddleware;
