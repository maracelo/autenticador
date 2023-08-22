'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    const DataTypes = Sequelize.DataTypes;

    return await queryInterface.createTable('change_email', {
      user_id: {
        primaryKey: true,
        type: DataTypes.STRING
      },
      new_email: DataTypes.STRING,
    });
  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.dropTable('change_email');
  }
};
