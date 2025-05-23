const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
} = require("./../controllers/todosController");

router.get("/", getTodos);
router.post("/", addTodo);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

module.exports = router;
