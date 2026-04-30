import { DataTypes, Model } from "sequelize";

class Stock extends Model {}

const initStockModel = (sequelize) => {
  Stock.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      stationId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      stockDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      quantity: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "Stock",
      tableName: "stocks",
      indexes: [{ unique: true, fields: ["stationId", "productId", "stockDate"] }]
    }
  );

  return Stock;
};

export default initStockModel;
