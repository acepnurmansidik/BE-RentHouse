const { DataTypes } = require("sequelize");
const DBConn = require("../../db");
const { BoardingResidenceModel } = require("./boarding_residence");

const ResidenceRoomModelDefine = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  room_type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  price_per_month: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  is_available: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  total_room: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 0,
  },
  residence_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: BoardingResidenceModel,
      key: "id",
    },
  },
};

const ResidenceRoomModel = DBConn.define(
  "residence_room",
  ResidenceRoomModelDefine,
  {
    timestamps: true,
    schema: "public",
    force: false,
    createdAt: true,
    updatedAt: true,
    paranoid: true,
    defaultScope: {
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
    },
  },
);

ResidenceRoomModel.belongsTo(BoardingResidenceModel, {
  foreignKey: "residence_id",
});
BoardingResidenceModel.hasMany(ResidenceRoomModel, {
  foreignKey: "residence_id",
});

delete ResidenceRoomModelDefine.id;
delete ResidenceRoomModelDefine.residence_id;
Object.keys(ResidenceRoomModelDefine).map((item) => {
  ResidenceRoomModelDefine[item] = ResidenceRoomModelDefine[item][
    "defaultValue"
  ]
    ? ResidenceRoomModelDefine[item]["defaultValue"]
    : null;
});

module.exports = { ResidenceRoomModelDefine, ResidenceRoomModel };
