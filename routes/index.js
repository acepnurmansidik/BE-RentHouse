const express = require("express");
const router = express.Router();
const userRouter = require("../resource/app/auth/router");
const roleRouter = require("../resource/app/role/router");
const cityRouter = require("../resource/app/city/router");

router.use(`/`, userRouter);
router.use(`/role`, roleRouter);
router.use(`/city`, cityRouter);

module.exports = router;
