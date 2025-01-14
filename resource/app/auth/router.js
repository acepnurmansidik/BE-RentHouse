const express = require("express");
const controller = require("./controller");
const { uploadFileImageConfig } = require("../../middleware/multer");
const router = express.Router();

router.post("/singup", controller.Register);
router.post("/signin", controller.Login);
router.post(
  "/upload-file",
  uploadFileImageConfig.array("proofs"),
  controller.uploadFile,
);

module.exports = router;
