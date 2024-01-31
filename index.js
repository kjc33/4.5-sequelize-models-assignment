require("dotenv").config();
const express = require("express");
const { sequelize, testConnection, Sequelize } = require("./models/conn");
// const Category = require('./models/categoryModel');
// const Item = require('./models/itemModel');
const { Item, Category } = require("./models/associations");

const PORT = 8080;

testConnection();

const app = express();
app.use(express.json());

sequelize
  .sync()
  .then(() => {
    console.log("Database & tables created!");
  })
  .catch((error) => {
    console.error("Error creating database & tables:", error);
  });

Item.sync({ alter: true })
  .then(() => {
    console.log("Table for Item model was updated successfully");
  })
  .catch((error) => {
    console.error("Error updating table for Item model:", error);
  });

// restrieve Category data
const findCategories = async () => {
  const result = await Category.findAll();
  console.log(JSON.stringify(result));
  return result;
};

// findCategories();

const findCategoriesByName = async () => {
  const result = await Category.findAll({
    where: {
      name: 4,
    },
  });
  console.log(JSON.stringify(result));
};

// findCategoriesByName();

const updatingCategory = async () => {
  const result = await Category.update(
    {
      name: "Electronics",
    },
    {
      where: {
        id: 5,
      },
    }
  );
  console.log(JSON.stringify(result));
};

// updatingCategory();

const deletingCategory = async () => {
  const result = await Category.destroy({
    where: {
      id: 4,
    },
  });
  console.log(JSON.stringify(result));
};

// deletingCategory();

// Associations
const findItems = async () => {
  const itemsWithCategory = await Item.findAll({
    include: [
      {
        model: Category,
        as: "category", // Only include if you have defined an alias in your association
      },
    ],
  });

  console.log(JSON.stringify(itemsWithCategory));
  return itemsWithCategory;
};

findItems();

const createFruitsCategory = async () => {
  try {
    // Create the "fruits" category
    const fruitsCategory = await Category.create({
      name: "fruits",
    });

    // Log the newly created category
    console.log("Fruits category created:", fruitsCategory.toJSON());

    // Return the generated id
    return fruitsCategory.id;
  } catch (error) {
    console.error("Error creating fruits category:", error);
    throw error;
  }
};

const createItemsForFruitsCategory = async () => {
  try {
    // Create the "fruits" category
    const fruitsCategoryId = await createFruitsCategory();

    // Create items for the "fruits" category
    const items = await Item.bulkCreate([
      { name: "apple", price: 1.99, description: "Juicy apple", categoryid: fruitsCategoryId },
      { name: "banana", price: 0.99, description: "Yellow banana", categoryid: fruitsCategoryId },
      // Add more items as needed
    ]);

    // Log the newly created items
    console.log("Items created for fruits category:", items.map(item => item.toJSON()));
  } catch (error) {
    console.error("Error creating items for fruits category:", error);
  }
};

// Call the function to create items for the "fruits" category
// createItemsForFruitsCategory();

// GET - /api/categories - get all categories using the findCategories function
app.get("/api/categories", async (req, res, next) => {
  try {
    const result = await findCategories();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// GET - /api/categories/:id - get category by id
app.get("/api/categories/:id", async (req, res, next) => {
  try {
    const result = await Category.findByPk(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// GET - api/categories/name/:name - get category by name
app.get("/api/categories/name/:name", async (req, res, next) => {
  try {
    const result = await Category.findAll({
      where: {
        name: req.params.name,
      },
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// GET - /api/items - get all items
app.get("/api/items", async (req, res, next) => {
  try {
    const result = await Item.findAll();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

const createItem = async () => {
  const result = await Item.create({
    name: "pork",
    price: 10,
    description: "Delicious pork.",
    categoryid: 2,
  });
  console.log(JSON.stringify(result));
  return result;
};

// createItem();

// 1) Create a Meats Category

const createNewMeatsCategory = async () => {
  await Category.create({
    name: "meats",
  });
  findCategories();
};

// createNewMeatsCategory();

// 2) Create items "pork" and "chicken"
const createItems = async () => {
  const meatsCategory = await Category.findOne({ where: { name: "meats" } });

  if (!meatsCategory) {
    console.error("Meats category not found.");
    return;
  }

  await Item.bulkCreate([
    { name: "pork", price: 10.99, description: "Delicious pork", categoryId: meatsCategory.id },
    { name: "chicken", price: 8.99, description: "Tender chicken", categoryId: meatsCategory.id },
  ]);
  console.log("Items created successfully.");
};

const findCategoryById = async (categoryId) => {
  const category = await Category.findByPk(categoryId);
  if (category) {
    console.log(`Category with ID ${categoryId} exists:`, category.toJSON());
  } else {
    console.log(`Category with ID ${categoryId} does not exist.`);
  }
};

findCategoryById(2); // Check category with ID 2
findCategoryById(3); // Check category with ID 3

// 3) Search for all fruits and display name and discription

const findAllFruits = async () => {
  const fruits = await Item.findAll({
    include: {
      model: Category,
      where: { name: "fruits" },
    },
  });
  console.log(
    "Fruits",
    fruits.map((item) => item.get({ plain: true }))
  );
};

// 4) Update all meat prices to 120.99

const updateMeatPrices = async () => {
  const meatsCategory = await Category.findOne({ where: { name: "meats" } });

  if (!meatsCategory) {
    console.error("Meats category not found.");
    return;
  }

  await Item.update(
    { price: 120.99 },
    {
      where: { categoryid: meatsCategory.id },
    }
  );
  console.log("Meat prices updated successfully.");
};

// 5) Select all items with prices greater than 20

const findItemsWithPriceGreaterThan20 = async () => {
  const items = await Item.findAll({
    where: { price: { $gt: 20 } },
  });
  console.log(
    "Items with price greater than 20:",
    items.map((item) => item.get({ plain: true }))
  );
};

(async () => {
  // await createItems();
  await findAllFruits();
  // await updateMeatPrices();
  await findItemsWithPriceGreaterThan20();
})();

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
