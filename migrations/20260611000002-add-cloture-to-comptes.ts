import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.changeColumn('comptes', 'status', {
      type: DataTypes.ENUM('active', 'inactive', 'bloque', 'cloture'),
      allowNull: false,
      defaultValue: 'active'
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.changeColumn('comptes', 'status', {
      type: DataTypes.ENUM('active', 'inactive', 'bloque'),
      allowNull: false,
      defaultValue: 'active'
    });
  }
};