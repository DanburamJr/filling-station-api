import { DataTypes, Model } from "sequelize";

class Station extends Model {}

const initStationModel = (sequelize) => {
  Station.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING(120),
        allowNull: false
      },
      location: {
        type: DataTypes.STRING(200),
        allowNull: false
      },
      managerId: {
        type: DataTypes.UUID,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: "Station",
      tableName: "stations"
    }
  );

  return Station;
};

export default initStationModel;
