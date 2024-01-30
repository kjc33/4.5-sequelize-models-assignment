const Category = require('./categoryModel');
const Item = require('./itemModel');

Item.belongsTo(Category, { foreignKey: 'categoryid' });
Category.hasMany(Item, { foreignKey: 'categoryid' });

module.exports = {
    Category,
    Item
};