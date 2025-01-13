const Mustache = require("mustache");
const nodemailer = require("nodemailer");
const ENV = require("../utils/config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../utils/errors");
const { StatusCodes } = require("http-status-codes");
const { methodConstant } = require("../utils/constanta");

const transporter = nodemailer.createTransport({
  host: ENV.emailHost,
  port: ENV.emailPort,
  secure: ENV.emailSecure, // true for 465, false for other ports
  auth: {
    user: ENV.emailSender,
    // password device
    pass: ENV.emailPassword,
  },
});

const globalFunc = {};

/**
 * -----------------------------------------------
 * | EMAIL
 * -----------------------------------------------
 * | if you wanna send email to yours friends
 * | or another people this function can do it
 * | don't worry this very secret, just you and me
 * |
 */
globalFunc.sendEmail = async ({ template, payload, receive, subject }) => {
  // Get template email from html file
  const tempFile = fs.readFileSync(
    `resource/app/templates/html/${template}.html`,
    "utf-8",
  );

  // create instance email/config email
  let message = {
    from: ENV.emailSender,
    to: receive,
    subject,
    html: Mustache.render(tempFile, payload),
  };

  // send email
  return await transporter.sendMail(message);
};

/**
 * -----------------------------------------------
 * | HASH PASSWORD
 * -----------------------------------------------
 * | Sometimes you must like anonymous, i mean
 * | your privacy keep safe, don't let people know
 * | so this function can be guard your privacy
 * |
 */
globalFunc.hashPassword = async ({ password }) => {
  return await bcrypt.hash(password, 12);
};

globalFunc.verifyPassword = async ({ password, hashPassword }) => {
  return await bcrypt.compare(password, hashPassword);
};

/**
 * -----------------------------------------------
 * | JSON WEB TOKEN
 * -----------------------------------------------
 * | if you wanna privacy data exchange
 * | this function can be help you
 * | and your privay keep safe using JWT
 * |
 */
globalFunc.generateJwtToken = async (payload, next) => {
  delete payload.password;
  const jwtSignOptions = {
    algorithm: ENV.algorithmToken,
    jwtid: ENV.jwtID,
  };
  // create token
  const token = await jwt.sign(payload, ENV.secretToken, jwtSignOptions);

  // verify token
  const refresh = await verifyJwtToken(token);
  delete refresh.jti;
  delete refresh.exp;
  delete refresh.iat;
  jwtSignOptions.expiresIn = ENV.jwtRefreshExpired;
  // create refresh token
  const refreshToken = await jwt.sign(refresh, ENV.secretToken, jwtSignOptions);

  return {
    token,
    refreshToken,
  };
};

const verifyJwtToken = async (token, next) => {
  try {
    // verify token
    const decode = await jwt.verify(token, ENV.secretToken, (err, decode) => {
      if (err) throw new UnauthenticatedError(err.message);
      if (!err) return decode;
    });
    return decode;
  } catch (err) {
    next(err);
  }
};

/**
 * -----------------------------------------------
 * | DYNAMIC QUERY SEARCH
 * -----------------------------------------------
 * | Hey it sounds good and powerfull for
 * | this function, you don't need to bother
 * | writing long search queries
 * |
 */
globalFunc.QuerySearch = async (payload) => {
  const result = {};
  for (const everyData of payload) {
    Object.keys(everyData["values"]).map((item) => {
      result[item] = {
        [Op[everyData["opr"]]]: `%${everyData["values"][item]}%`,
      };
      if ([compaOpr.ILIKE, compaOpr.NOT_ILIKE].includes(everyData["opr"])) {
        result[item] = {
          [Op[everyData["opr"]]]: `%${everyData["values"][item]}%`,
        };
      } else if (
        [
          compaOpr.IN,
          compaOpr.NOT_IN,
          compaOpr.BETWEEN,
          compaOpr.NOT_BETWEEN,
        ].includes(everyData["opr"])
      ) {
        let temp = [
          ...everyData["values"][item],
          `${everyData["values"][item]}`,
        ];
        result[item] = {
          [Op[everyData["opr"]]]: temp,
        };
      } else if ([compaOpr.AND, compaOpr.OR].includes(everyData["opr"])) {
        let temp = [
          ...everyData["values"][item],
          { item: `${everyData["values"][item]}` },
        ];
        result[item] = {
          [Op[everyData["opr"]]]: temp,
        };
      } else {
        result[item] = {
          [Op[everyData["opr"]]]: `${everyData["values"][item]}`,
        };
      }
    });
  }

  return result;
};

globalFunc.response = ({ res, method, data = null }) => {
  let response = {
    status_code: StatusCodes.OK,
    message: "success",
    data,
  };

  switch (method) {
    case methodConstant.POST:
      response.status_code = StatusCodes.CREATED;
      response.message = "Data has been created";
    case methodConstant.PUT:
      response.message = "Data has been updated";
    case methodConstant.DELETE:
      response.message = "Data has been deleted";
    case methodConstant.GET:
      response.message = "Data has been retrieved";
    default:
      break;
  }

  return res.status(response.status_code).json(response);
};

globalFunc.generateTokenCode = async () => {
  const tokenCode =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz";
  const token = [];
  for (let i = 0; i < 10; i++) {
    token.push(tokenCode[~~(Math.random() * tokenCode.length + 1)]);
  }

  return token.join("");
};

module.exports = { globalFunc, verifyJwtToken };
