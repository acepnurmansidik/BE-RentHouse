const { DataTypes } = require("sequelize");
const DBConn = require("../../db");
const { ResidenceRoomModel } = require("./residence_room");
const { BoardingResidenceModel } = require("./boarding_residence");

const BenefitModelDefine = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: false,
    defaultValue: "",
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

const BenefitModel = DBConn.define("benefit", BenefitModelDefine, {
  timestamps: true,
  force: false,
  createdAt: true,
  schema: "public",
  updatedAt: true,
  paranoid: true,
  defaultScope: {
    attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
  },
});

// benefit to onboarding
BenefitModel.belongsTo(ResidenceRoomModel, {
  foreignKey: "room_id",
  as: "benefit_room",
});
ResidenceRoomModel.hasMany(BenefitModel, {
  foreignKey: "room_id",
  as: "benefit_room",
});

delete BenefitModelDefine.id;
Object.keys(BenefitModelDefine).map((item) => {
  BenefitModelDefine[item] = BenefitModelDefine[item]["defaultValue"]
    ? BenefitModelDefine[item]["defaultValue"]
    : null;
});

module.exports = { BenefitModelDefine, BenefitModel };
