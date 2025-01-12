const { DataTypes } = require("sequelize");
const DBConn = require("../../db");

const ImageModelDefine = {
  id: {
    type: DataTypes.UUIDV4,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  source_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
};

const ImageModel = DBConn.define("image", ImageModelDefine, {
  timestamps: true,
  force: false,
  createdAt: true,
  updatedAt: true,
  paranoid: true,
});

Object.keys(ImageModelDefine).map((item) => {
  ImageModelDefine[item] = ImageModelDefine[item]["defaultValue"]
    ? ImageModelDefine[item]["defaultValue"]
    : null;
});

module.exports = { ImageModelDefine, ImageModel };
