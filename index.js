require('dotenv').config();
const express = require('express');
const { sequelize, testConnection } = require('./models/conn');
// const Category = require('./models/categoryModel');
// const Item = require('./models/itemModel');
const { Item, Category } = require('./models/associations'); // Adjust the path as necessary


const PORT = 8080;

testConnection();

const app = express();
app.use(express.json());

// restrieve Category data
const findCategories = async () => {
    const result = await Category.findAll();
    console.log(JSON.stringify(result));
    return result;
}

// findCategories();

const findCategoriesByName = async () => {
    const result = await Category.findAll({
        where: {
            name: 4
        }
    });
    console.log(JSON.stringify(result));
}

// findCategoriesByName();

const updatingCategory = async () => {
    const result = await Category.update({
        name: 'Electronics'
    }, {
        where: {
            id: 5
        }
    });
    console.log(JSON.stringify(result));
}

// updatingCategory();

const deletingCategory = async () => {
    const result = await Category.destroy({
        where: {
            id: 4
        }
    });
    console.log(JSON.stringify(result));
}

// deletingCategory();

// create a new item
const createItem = async () => {
    const result = await Item.create({
        name: 'Steak',
        price: 25,
        description: 'This is a steak',
        categoryid: 1
    });
    console.log(JSON.stringify(result));
    return result;
}

// createItem();

// Associations
const findItems = async () => {
    const itemsWithCategory = await Item.findAll({
        include: [{
            model: Category,
            as: 'category' // Only include if you have defined an alias in your association
        }]
    });

    console.log(JSON.stringify(itemsWithCategory));
    return itemsWithCategory;
}

findItems();

// GET - /api/categories - get all categories using the findCategories function
app.get('/api/categories', async (req, res, next) => {
    try {
        const result = await findCategories();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// GET - /api/categories/:id - get category by id
app.get('/api/categories/:id', async (req, res, next) => {
    try {
        const result = await Category.findByPk(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// GET - api/categories/name/:name - get category by name
app.get('/api/categories/name/:name', async (req, res, next) => {
    try {
        const result = await Category.findAll({
            where: {
                name: req.params.name
            }
        });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// GET - /api/items - get all items
app.get('/api/items', async (req, res, next) => {
    try {
        const result = await Item.findAll();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});