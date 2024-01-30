require('dotenv').config();
const {sequelize, testConnection} = require("./models/conn");

testConnection();