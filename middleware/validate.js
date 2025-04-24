const { body, param, validationResult } = require("express-validator");

// Валідація при створенні/оновленні користувача
const validateUser = [
  body("name")
    .notEmpty()
    .withMessage("Ім'я користувача є обов'язковим")
    .isLength({ min: 2, max: 100 })
    .withMessage("Довжина імені має бути від 2 до 100 символів"),

  body("email")
    .notEmpty()
    .withMessage("Email є обов'язковим")
    .isEmail()
    .withMessage("Введіть коректний email"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Валідація email користувача
const validateUserEmail = [
  param("email")
    .isEmail()
    .withMessage("Введіть коректний email"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateUser,
  validateUserEmail,
};
