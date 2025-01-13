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
    validate: {
      notEmpty: {
        msg: "Name can't be empty!",
      },
      // len: {
      //   args: [1, 255],
      //   msg: "Nama kota harus antara 1 dan 255 karakter.", // Pesan error kustom
      // },
    },
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
  defaultScope: {
    attributes: { exclude: ["createdAt", "updatedAt", "deletedAt", "slug"] },
  },
});

delete CityModelDefine.id;
delete CityModelDefine.slug;
Object.keys(CityModelDefine).map((item) => {
  CityModelDefine[item] = CityModelDefine[item]["defaultValue"]
    ? CityModelDefine[item]["defaultValue"]
    : null;
});

module.exports = { CityModelDefine, CityModel };
