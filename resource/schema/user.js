const { UserModelDefine } = require("../models/user");

const UserSchema = {
  BodyUserSchema: UserModelDefine,
  QueryUserSchema: {
    username: UserModelDefine.username,
  },
};

module.exports = UserSchema;
