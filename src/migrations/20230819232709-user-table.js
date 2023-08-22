'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    const DataTypes = Sequelize.DataTypes;

    return await queryInterface.createTable('users', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
      },
      name: {
          type: DataTypes.STRING
      },
      email: {
          type: DataTypes.STRING
      },
      verified_email: {
          type: DataTypes.BOOLEAN
      },
      password: {
          type: DataTypes.STRING
      },
      sub: {
          type: DataTypes.STRING,
          allowNull: true
      }
    });
  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.dropTable('users');
  }
};
