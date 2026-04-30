import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import sequelize from "./src/config/database.js";

const PORT = process.env.PORT || 5000;
const REQUIRED_DB_ENV_VARS = ["DB_HOST", "DB_PORT", "DB_NAME", "DB_USER", "DB_PASSWORD"];

function validateDatabaseEnv() {
  const missingVars = REQUIRED_DB_ENV_VARS.filter((key) => !process.env[key]?.trim());

  if (missingVars.length > 0) {
    console.error("Database configuration error: missing required environment variables.");
    console.error(`Missing: ${missingVars.join(", ")}`);
    console.error("Update your .env file and restart the application.");
    process.exit(1);
  }
}

function logConnectionFailure(error) {
  console.error("Failed to connect to PostgreSQL database.");
  console.error("Possible causes:");
  console.error("- Invalid DB_HOST/DB_PORT (database host unreachable)");
  console.error("- Incorrect DB_USER or DB_PASSWORD");
  console.error("- PostgreSQL service is not running");
  console.error("- Database name does not exist or user lacks permissions");

  if (error?.original?.code) {
    console.error(`PostgreSQL error code: ${error.original.code}`);
  }
  console.error("Detailed error:", error.message);
}

async function bootstrap() {
  validateDatabaseEnv();

  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");
  } catch (error) {
    logConnectionFailure(error);
    process.exit(1);
  }

  try {
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

bootstrap();