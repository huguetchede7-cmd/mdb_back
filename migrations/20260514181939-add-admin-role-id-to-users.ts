import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
    await queryInterface.addColumn('users', 'admin_role_id', {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: 'admin_roles',
            key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    });
}

export async function down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn('users', 'admin_role_id');
}