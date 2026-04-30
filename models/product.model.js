import { DataTypes, Model } from "sequelize";
import { FUEL_TYPES } from "../utils/constants.js";

class Product extends Model {}

const initProductModel = (sequelize) => {
  Product.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.ENUM(Object.values(FUEL_TYPES)),
        allowNull: false
      },
      unitPrice: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        validate: { min: 0 }
      },
      stationId: {
        type: DataTypes.UUID,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "products",
      indexes: [{ unique: true, fields: ["stationId", "name"] }]
    }
  );

  return Product;
};

export default initProductModel;
