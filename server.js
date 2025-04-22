const express = require("express");
require("dotenv").config();
const todosRouter = require("./routers/todosRouter");
const listsRouter = require("./routers/listsRouter");
const connectDB = require("./config/dbConnection");
const errorHandler = require("./middlewares/errorHandler");
const notFoundHandler = require("./middlewares/notFoundHandler");

const startServer = async () => {
  try {
    await connectDB();
    const app = express();

    app.use(express.json());
    app.use("/api/lists", listsRouter);
    app.use("/api/lists/:listId/todos", todosRouter);
    app.use(notFoundHandler);
    app.use(errorHandler);

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server listening on https://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Database connection failed");
    process.exit(1);
  }
};

startServer();
