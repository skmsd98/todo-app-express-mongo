const List = require("../models/List.model");
const Todo = require("../models/Todo.model");
const errorGenerator = require("../utils/errorGenerator");
const idValidator = require("../utils/idValidator");

const getLists = async (req, res, next) => {
  try {
    const lists = await List.find();
    res.status(200).json(lists);
  } catch (error) {
    next(error);
  }
};

const addList = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name?.trim()) {
      errorGenerator("List name is required");
    }

    if (name?.trim().length > 100) {
      errorGenerator("List name must not exceed 100 characters");
    }

    const newList = new List({ name });
    const response = await newList.save();
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

const updateList = async (req, res, next) => {
  try {
    idValidator(req.params.id);

    const { name } = req.body;

    if (!name.trim()) {
      errorGenerator("List name is required");
    }

    if (name.trim().length > 100) {
      errorGenerator("List name must not exceed 100 characters");
    }

    const updatedList = await List.findByIdAndUpdate(
      req.params.id,
      { name },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedList) errorGenerator("List not found", 404);
    res.status(200).json(updatedList);
  } catch (error) {
    next(error);
  }
};

const deleteList = async (req, res, next) => {
  try {
    idValidator(req.params.id);

    const deletedList = await List.findByIdAndDelete(req.params.id);

    if (!deletedList) errorGenerator("List not found", 404);

    Todo.deleteMany({ listId: req.params.id });

    res.status(200).json({ message: "Delete list and all associated Todos" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLists,
  addList,
  updateList,
  deleteList,
};
