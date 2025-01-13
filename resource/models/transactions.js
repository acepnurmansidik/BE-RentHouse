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
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Date.now(),
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "john doe",
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "087465497741",
  },
  price_per_month: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 500000,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "example@gmail.com",
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
  defaultScope: {
    attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
  },
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
delete TransactionModelDefine.user_id;
delete TransactionModelDefine.code_trx;
delete TransactionModelDefine.payment_status;
delete TransactionModelDefine.total_amount;
Object.keys(TransactionModelDefine).map((item) => {
  TransactionModelDefine[item] = TransactionModelDefine[item]["defaultValue"]
    ? TransactionModelDefine[item]["defaultValue"]
    : null;
});

module.exports = { TransactionModelDefine, TransactionModel };
