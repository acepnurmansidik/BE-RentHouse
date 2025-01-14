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
    defaultValue: "Kertasari Jaya",
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue:
      "Temukan kenyamanan tinggal di kosan kami yang strategis dan terjangkau! Setiap kamar dilengkapi dengan fasilitas lengkap, seperti Wi-Fi cepat, AC, dan tempat tidur yang nyaman. Lokasi kami dekat dengan pusat perbelanjaan, kampus, dan transportasi umum, memudahkan mobilitas Anda. Nikmati suasana yang ramah dan bersih, serta akses ke area bersama yang nyaman. Segera hubungi kami untuk mendapatkan penawaran spesial dan jadwalkan kunjungan Anda!",
  },
  thumbnail: {
    type: DataTypes.TEXT,
    defaultValue: "af03a4eb-7a79-4f4c-9aee-2be12dcea9ab",
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: "Jl. Angkasa No. 33, Kertasari, Bandung",
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "rent",
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
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt", "slug"] },
    },
  },
);

// boarding to city
BoardingResidenceModel.belongsTo(CityModel, {
  foreignKey: "city_id",
  as: "city",
});
CityModel.hasMany(BoardingResidenceModel, {
  foreignKey: "city_id",
  as: "city",
});

// boarding to owner
BoardingResidenceModel.belongsTo(UserModel, {
  foreignKey: "owner_id",
  as: "owner",
});
UserModel.hasMany(BoardingResidenceModel, {
  foreignKey: "owner_id",
  as: "owner",
});

delete BoardingResidenceModelDefine.id;
delete BoardingResidenceModelDefine.slug;
delete BoardingResidenceModelDefine.owner_id;
Object.keys(BoardingResidenceModelDefine).map((item) => {
  BoardingResidenceModelDefine[item] = BoardingResidenceModelDefine[item][
    "defaultValue"
  ]
    ? BoardingResidenceModelDefine[item]["defaultValue"]
    : null;
});

module.exports = { BoardingResidenceModelDefine, BoardingResidenceModel };
