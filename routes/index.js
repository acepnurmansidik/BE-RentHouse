const express = require("express");
const router = express.Router();
const userRouter = require("../resource/app/auth/router");
const roleRouter = require("../resource/app/role/router");

router.use(`/`, userRouter);
router.use(`/role`, roleRouter);

module.exports = router;
