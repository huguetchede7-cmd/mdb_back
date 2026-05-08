import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
    await queryInterface.addColumn('clients', 'status', {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'inactive',
    });
}

export async function down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn('clients', 'status');
}