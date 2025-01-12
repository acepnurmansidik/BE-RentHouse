const { DataTypes } = require("sequelize");
const DBConn = require("../../db");
const { ResidenceRoomModel } = require("./residence_room");

const FacilityModelDefine = {
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
  room_id: {
    type: DataTypes.UUIDV4,
    allowNull: false,
    references: {
      model: ResidenceRoomModel,
      key: "id",
    },
  },
};

const FacilityModel = DBConn.define("facility", FacilityModelDefine, {
  timestamps: true,
  force: false,
  createdAt: true,
  updatedAt: true,
  paranoid: true,
});

Object.keys(FacilityModelDefine).map((item) => {
  FacilityModelDefine[item] = FacilityModelDefine[item]["defaultValue"]
    ? FacilityModelDefine[item]["defaultValue"]
    : null;
});

module.exports = { FacilityModelDefine, FacilityModel };
