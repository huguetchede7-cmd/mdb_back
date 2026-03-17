'use strict';
import { QueryInterface } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.sequelize.query(
      `ALTER TABLE users ADD COLUMN fcm_token VARCHAR(255) NULL DEFAULT NULL AFTER jwt_token;`
    );
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.sequelize.query(
      `ALTER TABLE users DROP COLUMN fcm_token;`
    );
  }
};
