import sequelize from "../src/config/database.js";
import initUserModel from "./user.model.js";
import initStationModel from "./station.model.js";
import initProductModel from "./product.model.js";
import initShiftModel from "./shift.model.js";
import initSaleModel from "./sale.model.js";
import initExpenseModel from "./expense.model.js";
import initStockModel from "./stock.model.js";

const User = initUserModel(sequelize);
const Station = initStationModel(sequelize);
const Product = initProductModel(sequelize);
const Shift = initShiftModel(sequelize);
const Sale = initSaleModel(sequelize);
const Expense = initExpenseModel(sequelize);
const Stock = initStockModel(sequelize);

Station.hasMany(User, { foreignKey: "stationId", as: "users" });
User.belongsTo(Station, { foreignKey: "stationId", as: "station" });

Station.belongsTo(User, { foreignKey: "managerId", as: "manager" });
User.hasMany(Station, { foreignKey: "managerId", as: "managedStations" });

Station.hasMany(Product, { foreignKey: "stationId", as: "products" });
Product.belongsTo(Station, { foreignKey: "stationId", as: "station" });

Station.hasMany(Shift, { foreignKey: "stationId", as: "shifts" });
Shift.belongsTo(Station, { foreignKey: "stationId", as: "station" });
Shift.belongsTo(Product, { foreignKey: "productId", as: "product" });
Shift.belongsTo(User, { foreignKey: "attendantId", as: "attendant" });

Station.hasMany(Sale, { foreignKey: "stationId", as: "sales" });
Sale.belongsTo(Station, { foreignKey: "stationId", as: "station" });
Sale.belongsTo(Product, { foreignKey: "productId", as: "product" });
Sale.belongsTo(Shift, { foreignKey: "shiftId", as: "shift" });

Station.hasMany(Expense, { foreignKey: "stationId", as: "expenses" });
Expense.belongsTo(Station, { foreignKey: "stationId", as: "station" });
Expense.belongsTo(User, { foreignKey: "addedBy", as: "addedByUser" });

Station.hasMany(Stock, { foreignKey: "stationId", as: "stocks" });
Stock.belongsTo(Station, { foreignKey: "stationId", as: "station" });
Stock.belongsTo(Product, { foreignKey: "productId", as: "product" });

export {
  sequelize,
  User,
  Station,
  Product,
  Shift,
  Sale,
  Expense,
  Stock
};
