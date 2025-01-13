const express = require("express");
const controller = require("./controller");
const router = express.Router();

router.get("/", controller.index);
router.post("/", controller.createNewCity);
router.put("/:id", controller.updateCity);
router.delete("/:id", controller.deleteCity);

module.exports = router;
