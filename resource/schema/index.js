const RoleSchema = require("./roles");
const UserSchema = require("./user");

const GlobalSchema = { ...UserSchema, ...RoleSchema };

module.exports = GlobalSchema;
