import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
    await queryInterface.createTable('retraits', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        compte_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'comptes', key: 'id' },
        },
        client_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'clients', key: 'id' },
        },
        numero_transaction: { type: DataTypes.STRING, allowNull: false, unique: true },
        montant: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
        date_retrait: { type: DataTypes.DATEONLY, allowNull: false },
        mode_paiement: { type: DataTypes.STRING, allowNull: true },
        motif: { type: DataTypes.STRING, allowNull: true },
        observation: { type: DataTypes.TEXT, allowNull: true },
        status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'success' },
        created_by: { type: DataTypes.INTEGER, allowNull: true },
        created_at: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW },
        updated_at: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW },
        deleted_at: { type: DataTypes.DATE, allowNull: true },
    });
}

export async function down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('retraits');
}