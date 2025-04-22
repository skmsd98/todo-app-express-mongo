const Joi = require("joi");
const Todo = require("../models/Todo.model");
const errorGenerator = require("../utils/errorGenerator");
const idValidator = require("../utils/idValidator");
const List = require("../models/List.model");

const todoSchemaValidator = Joi.object({
  title: Joi.string().max(40).required(),
  description: Joi.string().max(300).required(),
  status: Joi.string().valid("active", "completed").default("active"),
  isStarred: Joi.boolean().default(false),
  order: Joi.number().allow(null),
  dueDate: Joi.date().allow(null),
});

const checkListExists = async (listId) => {
  idValidator(listId);

  const listExists = await List.findById(listId);

  if (!listExists) errorGenerator("List not found", 404);

  return listExists;
};

const getTodos = async (req, res, next) => {
  try {
    await checkListExists(req.params.listId);

    const { status, isStarred, search, dueDate } = req.query;

    const filter = {};

    if (status) filter.status = status;

    if (isStarred !== undefined) filter.isStarred = isStarred === "true";

    filter.listId = req.params.listId;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (dueDate) {
      const parsedDate = new Date(dueDate);
      if (!isNaN(parsedDate)) {
        const nextDay = new Date(parsedDate);
        nextDay.setDate(nextDay.getDate() + 1);

        filter.dueDate = { $gte: parsedDate, $lt: nextDay };
      }
    }

    const todos = await Todo.find(filter);

    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
};

const addTodo = async (req, res, next) => {
  try {
    await checkListExists(req.params.listId);

    const { error, value } = todoSchemaValidator.validate(req.body);

    if (error) errorGenerator(error.message);

    const newTodo = new Todo({ ...value, listId: req.params.listId });

    const response = await newTodo.save();

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

const updateTodo = async (req, res, next) => {
  try {
    await checkListExists(req.params.listId);

    idValidator(req.params.id);

    const { error, value } = todoSchemaValidator.validate(req.body, {
      presence: "optional",
    });
    if (error) errorGenerator(error.message, 400);

    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { ...value, listId: req.params.listId },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTodo) errorGenerator("Todo not found", 404);

    res.status(200).json(updatedTodo);
  } catch (error) {
    next(error);
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    await checkListExists(req.params.listId);

    idValidator(req.params.id);

    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);

    if (!deletedTodo) errorGenerator("Todo not found", 404);

    res.status(200).json(deletedTodo);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
};
