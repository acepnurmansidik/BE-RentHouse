const { DataTypes } = require("sequelize");
const DBConn = require("../../db");
const { ResidenceRoomModel } = require("./residence_room");
const { BoardingResidenceModel } = require("./boarding_residence");

const ImageModelDefine = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
    validate: {
      notEmpty: {
        msg: "Name can't be empty!",
      },
    },
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
  schema: "public",
  createdAt: true,
  updatedAt: true,
  paranoid: true,
  defaultScope: {
    attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
  },
});

ImageModel.belongsTo(ResidenceRoomModel, {
  foreignKey: "source_id",
  as: "room_images",
});
ResidenceRoomModel.hasMany(ImageModel, {
  foreignKey: "source_id",
  as: "room_images",
});

delete ImageModelDefine.id;
Object.keys(ImageModelDefine).map((item) => {
  ImageModelDefine[item] = ImageModelDefine[item]["defaultValue"]
    ? ImageModelDefine[item]["defaultValue"]
    : null;
});

module.exports = { ImageModelDefine, ImageModel };
