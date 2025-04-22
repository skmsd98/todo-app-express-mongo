const mongoose = require("mongoose");

const listSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "List name is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("List", listSchema);
