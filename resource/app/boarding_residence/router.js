const { uploadFileImageConfig } = require("../../middleware/multer");
const controller = require("./controller");
const router = require("express").Router();

// BoardingResidence
router.get("/", controller.index);
router.get("/owner", controller.indexOwnerBoardingResidence);
router.post("/", controller.createNewBoardingResidence);
router.put("/:id", controller.updateBoardingResidence);
router.delete("/:id", controller.deleteBoardingResidence);

// commentar
router.post("/comments", controller.createNewComment);
router.put("/comments/:id", controller.updateComment);
router.delete("/comments/:id", controller.deleteComment);

// testimonial
router.put("/testimonial/:id", controller.updateTestimonial);

// transaction
router.post("/trx", controller.createTransaction);
router.put("/trx/:id", controller.updatePaymentTransaction);

module.exports = router;
