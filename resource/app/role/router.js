const controller = require("./controller");
const router = require("express").Router();

router.get("/", controller.index);
router.post("/", controller.createNewRole);
router.put("/:id", controller.updateRole);
router.delete("/:id", controller.deleteRole);

module.exports = router;
