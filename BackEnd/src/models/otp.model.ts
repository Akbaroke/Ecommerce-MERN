import { Model, DataTypes, UUIDV4 } from "sequelize";
import db from "../configs/database.config";
import { type TYPE } from "../types/default";
export interface IOtpModel {
  otpId?: string;
  ip: string;
  email: string;
  otp: string;
  type?: TYPE;
  createdAt?: number;
  updatedAt?: number;
  expiredAt?: number;
}

class Otp extends Model<IOtpModel> {
  ip?: string;
  email?: string;
  otp?: string;
  type?: TYPE;
  updatedAt?: number;
  createdAt?: number;
  expiredAt?: number;
}

Otp.init(
  {
    otpId: {
      type: DataTypes.STRING,
      defaultValue: UUIDV4(),
      primaryKey: true,
      allowNull: false,
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "email",
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "otp",
    },
    type: {
      type: DataTypes.ENUM("register", "forgotPassword"),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    expiredAt: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  },
  {
    hooks: {
      beforeCreate: otp => {
        const time = Number(new Date().getTime()) + 180000;
        const createdAtAndUpdatedAt = new Date().getTime();
        otp.expiredAt = Number(time);
        otp.updatedAt = Number(createdAtAndUpdatedAt);
        otp.createdAt = Number(createdAtAndUpdatedAt);
      },
    },
    timestamps: false,
    sequelize: db,
    tableName: "Otps",
    freezeTableName: true,
  }
);

Otp.removeAttribute("id");
export default Otp;
