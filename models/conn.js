const { Sequelize } = require("sequelize");

const password = process.env.DB_PASSWORD.replace(/['"]+/g, ''); // Remove quotes

// DB config
const sequelize = new Sequelize(
  "ecommerce", // database name
  "postgres", // database username
  password, // database password
  {
    host: "localhost", // database host
    dialect: "postgres", // database dialect
    port: 5432, // database port
  }
);

// test the connection
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

module.exports = {
  testConnection,
  sequelize,
};
