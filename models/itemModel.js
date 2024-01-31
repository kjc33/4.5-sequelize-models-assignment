const { DataTypes } = require("sequelize");
const { sequelize } = require("./conn");
const Category = require("./categoryModel");

const Item = sequelize.define(
  "items",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryid: {
      type: DataTypes.INTEGER,
      references: {
        model: Category,
        key: "id",
      },
    },
  },
  {
    timestamps: false,
  }
);

// Add this to your code where you define your models
Item.sync()
  .then(() => {
    console.log("Table for Item model was created successfully");
  })
  .catch((error) => {
    console.error("Error creating table for Item model:", error);
  });

module.exports = Item;
