const { DataTypes } = require("sequelize");
const DBConn = require("../../db");
const { ResidenceRoomModel } = require("./residence_room");
const { UserModel } = require("./user");
const { TestimonialModel } = require("./testimonial");

const RoomCommentModelDefine = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: "",
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: UserModel,
      key: "id",
    },
  },
  room_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: ResidenceRoomModel,
      key: "id",
    },
  },
};

const RoomCommentModel = DBConn.define("room_comment", RoomCommentModelDefine, {
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

RoomCommentModel.belongsTo(UserModel, { foreignKey: "user_id" });
UserModel.hasMany(RoomCommentModel, { foreignKey: "user_id" });

RoomCommentModel.belongsTo(ResidenceRoomModel, { foreignKey: "room_id" });
ResidenceRoomModel.hasMany(RoomCommentModel, { foreignKey: "room_id" });

delete RoomCommentModelDefine.id;
Object.keys(RoomCommentModelDefine).map((item) => {
  RoomCommentModelDefine[item] = RoomCommentModelDefine[item]["defaultValue"]
    ? RoomCommentModelDefine[item]["defaultValue"]
    : null;
});

module.exports = { RoomCommentModelDefine, RoomCommentModel };
