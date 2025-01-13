const { DataTypes } = require("sequelize");
const DBConn = require("../../db");
const {
  ResidenceRoomModel,
  ResidenceRoomModelDefine,
} = require("./residence_room");

const FacilityModelDefine = {
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
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
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

const FacilityModel = DBConn.define("facility", FacilityModelDefine, {
  timestamps: true,
  force: false,
  schema: "public",
  createdAt: true,
  updatedAt: true,
  paranoid: true,
});

FacilityModel.belongsTo(ResidenceRoomModel, { foreignKey: "room_id" });
ResidenceRoomModel.hasMany(FacilityModel, { foreignKey: "room_id" });

Object.keys(FacilityModelDefine).map((item) => {
  FacilityModelDefine[item] = FacilityModelDefine[item]["defaultValue"]
    ? FacilityModelDefine[item]["defaultValue"]
    : null;
});

module.exports = { FacilityModelDefine, FacilityModel };
