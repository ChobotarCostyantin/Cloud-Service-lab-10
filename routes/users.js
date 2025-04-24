const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/authMiddleware");
const { validateUser, validateUserEmail } = require("../middleware/validate");

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Отримати список усіх користувачів
 *     description: Повертає масив усіх користувачів
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Успішно отримано список користувачів
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Необхідна авторизація
 */
router.get("/", authMiddleware, userController.getAllUsers);

/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Пошук користувачів за текстовим запитом
 *     description: Повертає список користувачів, що відповідають текстовому запиту
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         required: true
 *         description: Текстовий запит для пошуку (по індексованим текстовим полям)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Список користувачів, що відповідають запиту
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       404:
 *         description: Користувачів не знайдено
 *       401:
 *         description: Необхідна авторизація
 */
router.get("/search", authMiddleware, userController.searchUsers);

/**
 * @swagger
 * /users/{email}:
 *   get:
 *     summary: Отримати користувача за email
 *     description: Повертає користувача з вказаним email
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email користувача
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Успішно отримано користувача
 *       404:
 *         description: Користувача не знайдено
 *       401:
 *         description: Необхідна авторизація
 */
router.get(
  "/:email",
  authMiddleware,
  validateUserEmail,
  userController.getUserByEmail
);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Створити нового користувача
 *     description: Створює нового користувача та повертає його дані
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Користувача успішно створено
 *       400:
 *         description: Помилка валідації
 *       401:
 *         description: Необхідна авторизація
 */
router.post("/", authMiddleware, validateUser, userController.createUser);

/**
 * @swagger
 * /users/{email}:
 *   put:
 *     summary: Оновити користувача
 *     description: Оновлює дані користувача за email
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email користувача
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Користувача успішно оновлено
 *       404:
 *         description: Користувача не знайдено
 *       400:
 *         description: Помилка валідації
 *       401:
 *         description: Необхідна авторизація
 */
router.put(
  "/:email",
  authMiddleware,
  validateUserEmail,
  validateUser,
  userController.updateUser
);

/**
 * @swagger
 * /users/{email}:
 *   delete:
 *     summary: Видалити користувача
 *     description: Видаляє користувача за email
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email користувача
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Користувача успішно видалено
 *       404:
 *         description: Користувача не знайдено
 *       401:
 *         description: Необхідна авторизація
 */
router.delete(
  "/:email",
  authMiddleware,
  validateUserEmail,
  userController.deleteUser
);

/**
 * @swagger
 * /users/{email}:
 *   options:
 *     summary: Отримати доступні методи
 *     description: Повертає список доступних HTTP методів для ресурсу користувача
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email користувача
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Успішно отримано список методів
 *         headers:
 *           Allow:
 *             description: Список дозволених HTTP методів
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 description:
 *                   type: string
 *                 methods:
 *                   type: object
 *                   additionalProperties:
 *                     type: string
 *       401:
 *         description: Необхідна авторизація
 */
router.options(
  "/:email",
  authMiddleware,
  validateUserEmail,
  userController.getUserOptions
);

module.exports = router;
