'use strict';
import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.addColumn('users', 'fcm_token', {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn('users', 'fcm_token');
  }
};