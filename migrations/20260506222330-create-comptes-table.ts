import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
    await queryInterface.createTable('comptes', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        client_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'clients',
                key: 'id',
            },
        },
        numero_compte: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        type_compte: {
            type: DataTypes.ENUM('epargne_ordinaire', 'epargne_terme'),
            allowNull: false,
        },
        solde: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
        },
        solde_initial: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: true,
            defaultValue: 0,
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive', 'bloque'),
            allowNull: false,
            defaultValue: 'active',
        },
        date_ouverture: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    });
}

export async function down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('comptes');
}