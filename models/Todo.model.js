const mongoose = require("mongoose");

const todoSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description text is required"],
    },
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
    isStarred: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: null,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    listId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Todo", todoSchema);
