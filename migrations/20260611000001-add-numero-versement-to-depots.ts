import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
    await queryInterface.addColumn('depots', 'numero_versement', {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
    });
}

export async function down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn('depots', 'numero_versement');
}
