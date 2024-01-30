const { Sequelize } = require("sequelize");

// DB Connection Configuration
const sequelize = new Sequelize("ecommerce", "postgres", process.env.DB_PASSWORD, {
  host: "localhost",
  dialect: "postgres",
});

// Test Connection Function
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    return true;
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    return false;
  }
}

module.exports = { sequelize, testConnection };
