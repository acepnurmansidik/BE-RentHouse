const { DataTypes } = require("sequelize");
const DBConn = require("../../db");

const RolesModelDefine = {
  id: {
    type: DataTypes.UUIDV4,
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
    unique: true,
    defaultValue: "",
  },
};

const RolesModel = DBConn.define("role", RolesModelDefine, {
  timestamps: true,
  force: false,
  createdAt: true,
  updatedAt: true,
  paranoid: true,
});

Object.keys(RolesModelDefine).map((item) => {
  RolesModelDefine[item] = RolesModelDefine[item]["defaultValue"]
    ? RolesModelDefine[item]["defaultValue"]
    : null;
});

module.exports = { RolesModelDefine, RolesModel };
