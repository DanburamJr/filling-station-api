import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import sequelize from "./src/config/database.js";

const PORT = process.env.PORT || 5000;

function validateDatabaseEnv() {
  if (!process.env.DATABASE_URL?.trim()) {
    console.error("Database configuration error: missing required environment variable.");
    console.error("Missing: DATABASE_URL");
    console.error("Update your .env file and restart the application.");
    process.exit(1);
  }
}

function logConnectionFailure(error) {
  console.error("Failed to connect to PostgreSQL database.");
  console.error("Possible causes:");
  console.error("- Invalid DATABASE_URL (malformed connection string)");
  console.error("- Incorrect credentials in DATABASE_URL");
  console.error("- PostgreSQL service is not running");
  console.error("- Database does not exist or user lacks permissions");

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