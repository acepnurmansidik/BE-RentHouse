const controller = require("./controller");
const router = require("express").Router();

router.get("/", controller.index);
router.post("/", controller.createNewBoardingResidence);
router.put("/:id", controller.updateBoardingResidence);
router.delete("/:id", controller.deleteBoardingResidence);

module.exports = router;
