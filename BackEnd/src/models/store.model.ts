import { Model, DataTypes } from "sequelize";
import db from "../configs/database.config";
import Image from "./image.model";

export interface IStoreModel {
  idStore?: string;
  nameStore: string;
  idImage?: string | null;
  access?: any;
  tax?: number;
  discount?: number;
  income?: number;
  createdAt?: number;
  updatedAt?: number;
}

class Store extends Model<IStoreModel> {
  nameStore?: string;
  access?: any;
  createdAt?: number;
  updatedAt?: number;
  image?: Image;
}

Store.init(
  {
    idStore: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    idImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nameStore: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    access: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tax: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    income: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  },
  {
    hooks: {
      beforeCreate: data => {
        const createdAtAndUpdatedAt = new Date().getTime();
        data.createdAt = Number(createdAtAndUpdatedAt);
        data.updatedAt = Number(createdAtAndUpdatedAt);
      },
    },
    sequelize: db,
    timestamps: false,
    tableName: "Stores",
    freezeTableName: true,
  }
);

Store.removeAttribute("id");
Image.hasOne(Store, { foreignKey: "idImage" });
Store.belongsTo(Image, { as: "image", foreignKey: "idImage" });
export default Store;
