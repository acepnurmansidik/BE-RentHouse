const { DataTypes } = require("sequelize");
const DBConn = require("../../db");
const { ResidenceRoomModel } = require("./residence_room");
const { UserModel } = require("./user");

const RoomCommentModelDefine = {
  id: {
    type: DataTypes.UUIDV4,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: "",
  },
  user_id: {
    type: DataTypes.UUIDV4,
    allowNull: false,
    references: {
      model: UserModel,
      key: "id",
    },
  },
  room_id: {
    type: DataTypes.UUIDV4,
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
  createdAt: true,
  updatedAt: true,
  paranoid: true,
});

Object.keys(RoomCommentModelDefine).map((item) => {
  RoomCommentModelDefine[item] = RoomCommentModelDefine[item]["defaultValue"]
    ? RoomCommentModelDefine[item]["defaultValue"]
    : null;
});

module.exports = { RoomCommentModelDefine, RoomCommentModel };
