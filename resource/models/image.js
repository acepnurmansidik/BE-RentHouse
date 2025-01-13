const { DataTypes } = require("sequelize");
const DBConn = require("../../db");
const { ResidenceRoomModel } = require("./residence_room");

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
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  source_id: {
    type: DataTypes.UUID,
    allowNull: true,
    defaultValue: null,
  },
};

const ImageModel = DBConn.define("image", ImageModelDefine, {
  timestamps: true,
  force: false,
  createdAt: true,
  updatedAt: true,
  paranoid: true,
});

ImageModel.belongsTo(ResidenceRoomModel, { foreignKey: "source_id" });
ResidenceRoomModel.hasMany(ImageModel, { foreignKey: "source_id" });

Object.keys(ImageModelDefine).map((item) => {
  ImageModelDefine[item] = ImageModelDefine[item]["defaultValue"]
    ? ImageModelDefine[item]["defaultValue"]
    : null;
});

module.exports = { ImageModelDefine, ImageModel };
