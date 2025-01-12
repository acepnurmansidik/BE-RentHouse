const { DataTypes } = require("sequelize");
const DBConn = require("../../db");
const { UserModel } = require("./user");
const { CityModel } = require("./city");

const BoardingResidenceModelDefine = {
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
    createdAt: true,
    updatedAt: true,
    paranoid: true,
  },
);

Object.keys(BoardingResidenceModelDefine).map((item) => {
  BoardingResidenceModelDefine[item] = BoardingResidenceModelDefine[item][
    "defaultValue"
  ]
    ? BoardingResidenceModelDefine[item]["defaultValue"]
    : null;
});

module.exports = { BoardingResidenceModelDefine, BoardingResidenceModel };
