const { DataTypes } = require("sequelize");
const DBConn = require("../../db");
const { ResidenceRoomModel } = require("./residence_room");

const BenefitModelDefine = {
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
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    defaultValue: "",
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
    defaultValue: "",
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

const BenefitModel = DBConn.define("benefit", BenefitModelDefine, {
  timestamps: true,
  force: false,
  createdAt: true,
  updatedAt: true,
  paranoid: true,
});

Object.keys(BenefitModelDefine).map((item) => {
  BenefitModelDefine[item] = BenefitModelDefine[item]["defaultValue"]
    ? BenefitModelDefine[item]["defaultValue"]
    : null;
});

module.exports = { BenefitModelDefine, BenefitModel };
