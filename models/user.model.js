import { DataTypes, Model } from "sequelize";
import bcrypt from "bcryptjs";
import { USER_ROLES } from "../utils/constants.js";

class User extends Model {
  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

const initUserModel = (sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      fullName: {
        type: DataTypes.STRING(120),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(120),
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
      },
      password: {
        type: DataTypes.STRING(120),
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM(Object.values(USER_ROLES)),
        allowNull: false,
        defaultValue: USER_ROLES.ATTENDANT
      },
      stationId: {
        type: DataTypes.UUID,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      hooks: {
        async beforeCreate(user) {
          user.password = await bcrypt.hash(user.password, 10);
        },
        async beforeUpdate(user) {
          if (user.changed("password")) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        }
      }
    }
  );

  return User;
};

export default initUserModel;
