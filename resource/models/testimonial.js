const { DataTypes } = require("sequelize");
const DBConn = require("../../db");
const { ResidenceRoomModel } = require("./residence_room");
const { UserModel } = require("./user");

const TestimonialModelDefine = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
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

const TestimonialModel = DBConn.define("testimonial", TestimonialModelDefine, {
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

TestimonialModel.belongsTo(UserModel, { foreignKey: "user_id" });
UserModel.hasMany(TestimonialModel, { foreignKey: "user_id" });

TestimonialModel.belongsTo(ResidenceRoomModel, { foreignKey: "room_id" });
ResidenceRoomModel.hasMany(TestimonialModel, { foreignKey: "room_id" });

delete TestimonialModelDefine.id;
delete TestimonialModelDefine.user_id;
delete TestimonialModelDefine.room_id;
delete TestimonialModelDefine.status;
Object.keys(TestimonialModelDefine).map((item) => {
  TestimonialModelDefine[item] = TestimonialModelDefine[item]["defaultValue"]
    ? TestimonialModelDefine[item]["defaultValue"]
    : null;
});

module.exports = { TestimonialModelDefine, TestimonialModel };
