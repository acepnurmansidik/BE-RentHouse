const { DataTypes } = require("sequelize");
const DBConn = require("../../db");
const { RolesModel } = require("./roles");

const UserModelDefine = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
    // validate: {
    //   isEmail: true, // Pastikan nilai email sesuai format email
    // },
    defaultValue: "john.owner",
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "123456",
  },
  otp_code: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  role_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: RolesModel,
      key: "id",
    },
  },
};

const UserModel = DBConn.define("user", UserModelDefine, {
  timestamps: true,
  schema: "public",
  force: false,
  createdAt: true,
  updatedAt: true,
  paranoid: true,
  defaultScope: {
    attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
  },
});

// definisikan relasi
UserModel.belongsTo(RolesModel, { foreignKey: "role_id" });
RolesModel.hasOne(UserModel, { foreignKey: "role_id" });

delete UserModelDefine.id;
delete UserModelDefine.otp_code;
delete UserModelDefine.status;
Object.keys(UserModelDefine).map((item) => {
  UserModelDefine[item] = UserModelDefine[item]["defaultValue"]
    ? UserModelDefine[item]["defaultValue"]
    : null;
});

module.exports = { UserModelDefine, UserModel };
