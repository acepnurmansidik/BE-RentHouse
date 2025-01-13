const controller = require("./controller");

const router = require("express").Router();

router.get("/", controller.index);
router.post("/", controller.createNewBoardingResidence);

module.exports = router;
