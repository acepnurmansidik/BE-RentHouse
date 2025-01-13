const { DataTypes } = require("sequelize");
const DBConn = require("../../db");
const { ResidenceRoomModel } = require("./residence_room");

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
  defaultScope: {
    attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
  },
});

FacilityModel.belongsTo(ResidenceRoomModel, { foreignKey: "room_id" });
ResidenceRoomModel.hasMany(FacilityModel, { foreignKey: "room_id" });

delete FacilityModelDefine.id;
delete FacilityModelDefine.slug;
Object.keys(FacilityModelDefine).map((item) => {
  FacilityModelDefine[item] = FacilityModelDefine[item]["defaultValue"]
    ? FacilityModelDefine[item]["defaultValue"]
    : null;
});

module.exports = { FacilityModelDefine, FacilityModel };
