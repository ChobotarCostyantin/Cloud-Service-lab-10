const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const usersRouter = require("./routes/users");
const errorHandler = require("./middleware/errorHandler");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const MONGODB_URI = dotenv.parsed.MONGODB_URI || process.env.MONGODB_URI;
// Ініціалізація express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware для парсингу JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware для підтримки нестандартних HTTP-методів
app.use(methodOverride("_method"));

// Middleware для логування запитів
app.use(morgan("dev"));

// Налаштування Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Users API",
      version: "1.0.0",
      description: "API для роботи з користувачами",
    },
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "Auth-Token",
        },
      },
    },
    security: [
      {
        ApiKeyAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js", "./controllers/*.js"], // шляхи до файлів з API анотаціями
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Підключення маршрутів
app.use("/users", usersRouter);

// Обробка запитів до неіснуючих маршрутів
app.use((req, res, next) => {
  const error = new Error("Не знайдено");
  error.status = 404;
  next(error);
});

// Middleware для обробки помилок
app.use(errorHandler);

// Підключення до MongoDB
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Підключено до MongoDB");
    // Запуск сервера
    app.listen(PORT, () => {
      console.log(`Сервер запущено на порту ${PORT}`);
      console.log(`Документація API: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error("Помилка підключення до MongoDB:", err.message);
    console.log(`Connetion string: ${MONGODB_URI}`);
  });

module.exports = app;
