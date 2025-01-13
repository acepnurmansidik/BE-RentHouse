const { verifyJwtToken } = require("../helper/global-func");
const { UserModel } = require("../models/user");
const { UnauthenticatedError } = require("../utils/errors");
const NotFound = require("../utils/errors/not-found");

const AuthorizeUserLogin = async (req, res, next) => {
  try {
    // get JWT token from header
    const authHeader =
      req.headers.authorization?.split(" ")[
        req.headers.authorization.split(" ").length - 1
      ];

    // send error Token not found
    if (!authHeader) throw new UnauthenticatedError("Invalid credentials!");

    // verify JWT token
    const dataValid = await verifyJwtToken(authHeader, next);

    // check username is register on database
    const verifyData = await UserModel.findOne({
      where: { username: dataValid.username },
      attributes: ["id", "username", "role_id"],
      raw: true,
    });

    // send error not found, if data not register
    if (!verifyData) throw new NotFound("Data not register!");

    req.login = { ...verifyData };
    // next to controller
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { AuthorizeUserLogin };
