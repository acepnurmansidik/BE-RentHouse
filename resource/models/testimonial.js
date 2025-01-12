const { DataTypes } = require("sequelize");
const DBConn = require("../../db");
const { ResidenceRoomModel } = require("./residence_room");
const { UserModel } = require("./user");

const TestimonialModelDefine = {
  id: {
    type: DataTypes.UUIDV4,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
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

const TestimonialModel = DBConn.define("testimonial", TestimonialModelDefine, {
  timestamps: true,
  force: false,
  createdAt: true,
  updatedAt: true,
  paranoid: true,
});

Object.keys(TestimonialModelDefine).map((item) => {
  TestimonialModelDefine[item] = TestimonialModelDefine[item]["defaultValue"]
    ? TestimonialModelDefine[item]["defaultValue"]
    : null;
});

module.exports = { TestimonialModelDefine, TestimonialModel };
