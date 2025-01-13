const { DataTypes } = require("sequelize");
const DBConn = require("../../db");
const { UserModel } = require("./user");
const { CityModel } = require("./city");

const BoardingResidenceModelDefine = {
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
  description: {
    type: DataTypes.TEXT,
    defaultValue: "",
  },
  thumbnail: {
    type: DataTypes.TEXT,
    defaultValue: "",
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: "",
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  city_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: CityModel,
      key: "id",
    },
  },
  owner_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: UserModel,
      key: "id",
    },
  },
};

const BoardingResidenceModel = DBConn.define(
  "boarding_residence",
  BoardingResidenceModelDefine,
  {
    timestamps: true,
    force: false,
    schema: "public",
    createdAt: true,
    updatedAt: true,
    paranoid: true,
    defaultScope: {
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
    },
  },
);

// boarding to city
BoardingResidenceModel.belongsTo(CityModel, { foreignKey: "city_id" });
CityModel.hasMany(BoardingResidenceModel, { foreignKey: "city_id" });

// boarding to owner
BoardingResidenceModel.belongsTo(UserModel, { foreignKey: "owner_id" });
UserModel.hasMany(BoardingResidenceModel, { foreignKey: "owner_id" });

delete BoardingResidenceModelDefine.id;
delete BoardingResidenceModelDefine.slug;
delete BoardingResidenceModelDefine.thumbnail;
delete BoardingResidenceModelDefine.owner_id;
Object.keys(BoardingResidenceModelDefine).map((item) => {
  BoardingResidenceModelDefine[item] = BoardingResidenceModelDefine[item][
    "defaultValue"
  ]
    ? BoardingResidenceModelDefine[item]["defaultValue"]
    : null;
});

module.exports = { BoardingResidenceModelDefine, BoardingResidenceModel };
