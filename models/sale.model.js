import { DataTypes, Model } from "sequelize";

class Sale extends Model {}

const initSaleModel = (sequelize) => {
  Sale.init(
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
      shiftId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true
      },
      litersSold: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
      },
      unitPrice: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
      },
      totalAmount: {
        type: DataTypes.DECIMAL(14, 2),
        allowNull: false
      },
      saleDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "Sale",
      tableName: "sales"
    }
  );

  return Sale;
};

export default initSaleModel;
