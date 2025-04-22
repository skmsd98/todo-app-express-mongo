const express = require("express");
const {
  getLists,
  addList,
  updateList,
  deleteList,
} = require("../controllers/listsController");
const router = express.Router();

router.get("/", getLists);
router.post("/", addList);
router.put("/:id", updateList);
router.delete("/:id", deleteList);

module.exports = router;
