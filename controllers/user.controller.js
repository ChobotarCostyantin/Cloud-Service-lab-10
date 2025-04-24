const User = require("../models/User");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         _id:
 *           type: string
 *           description: ID користувача (автоматично генерується MongoDB)
 *         name:
 *           type: string
 *           description: Ім'я користувача
 *         email:
 *           type: string
 *           format: email
 *           description: Email користувача
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Дата створення
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Дата останнього оновлення
 */

const userController = {
  /**
   * Отримання всіх користувачів
   */
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  /**
   * Отримання користувача за Email
   */
  getUserByEmail: async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.params.email });

      if (!user) {
        const error = new Error("Користувача не знайдено");
        error.status = 404;
        return next(error);
      }

      res.json(user);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Пошук користувачів
   */
  searchUsers: async (req, res, next) => {
    try {
      const { search } = req.query;
      const users = await User.find({
        $or: [{ email: search }, { name: { $regex: search, $options: "i" } }],
      });

      if (users.length === 0) {
        const error = new Error("Користувачів не знайдено");
        error.status = 404;
        return next(error);
      }

      res.json(users);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Створення нового користувача
   */
  createUser: async (req, res, next) => {
    try {
      const { name, email } = req.body;
      const newUser = new User({ name, email });

      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (err) {
      if (err.code === 11000) {
        // MongoDB код для унікальних обмежень
        const error = new Error("Користувач з таким email вже існує");
        error.status = 400;
        return next(error);
      }
      if (err.name === "ValidationError") {
        const error = new Error(err.message);
        error.status = 400;
        return next(error);
      }
      next(err);
    }
  },

  /**
   * Оновлення існуючого користувача за Email
   */
  updateUser: async (req, res, next) => {
    try {
      const { name, email } = req.body;

      const updatedUser = await User.findOneAndUpdate(
        { email: req.params.email },
        { name, email },
        { new: true }
      );

      if (!updatedUser) {
        const error = new Error("Користувача не знайдено");
        error.status = 404;
        return next(error);
      }
      res.json(updatedUser);
    } catch (err) {
      if (err.code === 11000) {
        const error = new Error("Такий email вже використовується");
        error.status = 400;
        return next(error);
      }
      if (err.name === "ValidationError") {
        const error = new Error(err.message);
        error.status = 400;
        return next(error);
      }
      next(err);
    }
  },

  /**
   * Видалення користувача за Email
   */
  deleteUser: async (req, res, next) => {
    try {
      const deletedUser = await User.findOneAndDelete({
        email: req.params.email,
      });

      if (!deletedUser) {
        const error = new Error("Користувача не знайдено");
        error.status = 404;
        return next(error);
      }

      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },

  /**
   * OPTIONS метод - повертає доступні методи для ресурсу
   */
  getUserOptions: (req, res) => {
    res.set("Allow", "GET, PUT, DELETE, OPTIONS");
    res.status(200).json({
      description: "Ресурс користувача",
      methods: {
        GET: "Отримати користувача",
        PUT: "Оновити користувача",
        DELETE: "Видалити користувача",
        OPTIONS: "Отримати список доступних методів",
      },
    });
  },
};

module.exports = userController;
