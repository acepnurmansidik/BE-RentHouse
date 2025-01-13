const express = require("express");
const controller = require("./controller");
const router = express.Router();

router.get("/", controller.index);
router.post("/", controller.createNewRole);
router.put("/:id", controller.updateRole);
router.delete("/:id", controller.deleteRole);

module.exports = router;
