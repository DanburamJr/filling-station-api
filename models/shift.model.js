import { DataTypes, Model } from "sequelize";

class Shift extends Model {}

const initShiftModel = (sequelize) => {
  Shift.init(
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
      attendantId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      shiftDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      openingStock: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
      },
      closingStock: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true
      },
      fuelSold: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM("open", "closed"),
        allowNull: false,
        defaultValue: "open"
      }
    },
    {
      sequelize,
      modelName: "Shift",
      tableName: "shifts"
    }
  );

  return Shift;
};

export default initShiftModel;
