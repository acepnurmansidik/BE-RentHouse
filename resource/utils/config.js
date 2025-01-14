const dotEnv = require("dotenv");
dotEnv.config();

const ENV = {
  userName: process.env.DB_USER,
  hostName: process.env.DB_HOST,
  password: process.env.DB_PASS,
  databaseName: process.env.DB_NAME,
  timeZone: process.env.DB_TZ,
  maxPool: process.env.MAX_POOL,
  dbPort: process.env.DB_PORT,
  jwtID: process.env.JWT_ID,
  jwtExpired: process.env.TOKEN_EXPIRED,
  jwtRefreshExpired: process.env.REFRESH_TOKEN_EXPIRED,
  secretToken: process.env.TOKEN_SECRET,
  algorithmToken: process.env.TOKEN_ALGORITHM,
  emailHost: process.env.HOST_EMAIL,
  emailPort: process.env.PORT_EMAIL,
  emailSecure: process.env.SECURE_EMAIL,
  emailSender: process.env.SOURCE_EMAIL,
  emailPassword: process.env.PASSWORD_EMAIL,
  saltPassword: process.env.SALT,
  urlImage: `${process.env.URL_API}${process.env.DB_HOST}:${process.env.DB_PORT}/`,
};

module.exports = ENV;
