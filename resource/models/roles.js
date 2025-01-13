const { DataTypes } = require("sequelize");
const DBConn = require("../../db");

const RolesModelDefine = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
    defaultValue: "",
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    message: "Duplicate name",
    unique: true,
    defaultValue: "",
  },
};

const RolesModel = DBConn.define("role", RolesModelDefine, {
  timestamps: true,
  force: false,
  schema: "public",
  createdAt: true,
  updatedAt: true,
  paranoid: true,
});

delete RolesModelDefine.id;
delete RolesModelDefine.slug;
Object.keys(RolesModelDefine).map((item) => {
  RolesModelDefine[item] = RolesModelDefine[item]["defaultValue"]
    ? RolesModelDefine[item]["defaultValue"]
    : null;
});

module.exports = { RolesModelDefine, RolesModel };
