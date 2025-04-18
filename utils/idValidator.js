const mongoose = require("mongoose");
const errorGenerator = require("./errorGenerator");

module.exports = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorGenerator("Invalid ID", 400);
  }
};
