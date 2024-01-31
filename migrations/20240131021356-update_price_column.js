'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('items', 'price', {
      type: Sequelize.DECIMAL(10, 2), // Adjust precision and scale as needed
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('items', 'price', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  }
};
