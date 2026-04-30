import { DataTypes, Model } from "sequelize";

class Expense extends Model {}

const initExpenseModel = (sequelize) => {
  Expense.init(
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
      addedBy: {
        type: DataTypes.UUID,
        allowNull: false
      },
      expenseDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      category: {
        type: DataTypes.STRING(80),
        allowNull: false
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      amount: {
        type: DataTypes.DECIMAL(14, 2),
        allowNull: false,
        validate: { min: 0 }
      }
    },
    {
      sequelize,
      modelName: "Expense",
      tableName: "expenses"
    }
  );

  return Expense;
};

export default initExpenseModel;
