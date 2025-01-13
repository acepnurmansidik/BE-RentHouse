const express = require("express");
const router = express.Router();
const userRouter = require("../resource/app/auth/router");
const roleRouter = require("../resource/app/role/router");
const cityRouter = require("../resource/app/city/router");
const boardingResidenceRouter = require("../resource/app/boarding_residence/router");
const { AuthorizeUserLogin } = require("../resource/middleware/authentication");

router.use(`/`, userRouter);
router.use(AuthorizeUserLogin);
router.use(`/role`, roleRouter);
router.use(`/city`, cityRouter);
router.use(`/boarding-residence`, boardingResidenceRouter);

module.exports = router;
