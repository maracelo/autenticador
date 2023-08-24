'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const DataTypes = Sequelize.DataTypes;

    return await queryInterface.createTable('session', {
      sid: {
        primaryKey: true,
        type: DataTypes.STRING
      },
      sess: {
        type: DataTypes.JSON
      },
      expire: {
        type: DataTypes.DATE
      }
    })
  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.dropTable('session');
  }
};
