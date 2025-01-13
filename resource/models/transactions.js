const { DataTypes } = require("sequelize");
const DBConn = require("../../db");
const { ResidenceRoomModel } = require("./residence_room");
const { UserModel } = require("./user");
const { BoardingResidenceModel } = require("./boarding_residence");

const TransactionModelDefine = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  total_amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  payment_status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  code_trx: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  price_oer_month: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  email: {
    type: DataTypes.STRING,
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
  residence_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: BoardingResidenceModel,
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

const TransactionModel = DBConn.define("transaction", TransactionModelDefine, {
  timestamps: true,
  force: false,
  schema: "public",
  createdAt: true,
  updatedAt: true,
  paranoid: true,
});

TransactionModel.belongsTo(UserModel, { foreignKey: "user_id" });
UserModel.hasMany(TransactionModel, { foreignKey: "user_id" });

TransactionModel.belongsTo(ResidenceRoomModel, { foreignKey: "room_id" });
ResidenceRoomModel.hasMany(TransactionModel, { foreignKey: "room_id" });

TransactionModel.belongsTo(BoardingResidenceModel, {
  foreignKey: "residence_id",
});
BoardingResidenceModel.hasMany(TransactionModel, {
  foreignKey: "residence_id",
});

delete TransactionModelDefine.id;
Object.keys(TransactionModelDefine).map((item) => {
  TransactionModelDefine[item] = TransactionModelDefine[item]["defaultValue"]
    ? TransactionModelDefine[item]["defaultValue"]
    : null;
});

module.exports = { TransactionModelDefine, TransactionModel };
