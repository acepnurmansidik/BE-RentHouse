const { UserModelDefine } = require("../resource/models/user");

const UserSchema = {
  BodyUserSchema: UserModelDefine,
  QueryUserSchema: {
    username: UserModelDefine.username,
  },
};

module.exports = UserSchema;
