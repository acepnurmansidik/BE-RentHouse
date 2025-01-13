const { DataTypes } = require("sequelize");
const DBConn = require("../../db");

const CityModelDefine = {
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
    unique: true,
    defaultValue: "",
  },
};

const CityModel = DBConn.define("city", CityModelDefine, {
  timestamps: true,
  force: false,
  schema: "public",
  createdAt: true,
  updatedAt: true,
  paranoid: true,
});

Object.keys(CityModelDefine).map((item) => {
  CityModelDefine[item] = CityModelDefine[item]["defaultValue"]
    ? CityModelDefine[item]["defaultValue"]
    : null;
});

module.exports = { CityModelDefine, CityModel };
