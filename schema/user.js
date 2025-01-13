const { UserModelDefine } = require("../resource/models/user");

const UserSchema = {
  BodyRegisterSchema: {
    username: "john.customer",
    password: "123456",
    role_id: "uuid",
  },
  BodyLoginSchema: {
    username: "john.owner",
    password: "123456",
  },
  QueryUserSchema: {
    username: UserModelDefine.username,
  },
};

module.exports = UserSchema;
