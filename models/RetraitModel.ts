import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import modelHelpers from '../app/helpers/modelHelpers';
import CompteModel from './CompteModel';
import ClientModel from './ClientModel';

interface RetraitAttributes {
    id?: number;
    compte_id: number;
    client_id: number;
    numero_transaction: string;
    montant: number;
    date_retrait: string;
    mode_paiement?: string | null;
    motif?: string | null;
    observation?: string | null;
    status?: string;
    created_by?: number | null;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
}

class RetraitModel extends Model<RetraitAttributes> implements RetraitAttributes {
    declare id: number;
    declare compte_id: number;
    declare client_id: number;
    declare numero_transaction: string;
    declare montant: number;
    declare date_retrait: string;
    declare mode_paiement: string | null;
    declare motif: string | null;
    declare observation: string | null;
    declare status: string;
    declare created_by: number | null;
    declare created_at: Date | string | null;
    declare updated_at: Date | string | null;
    declare deleted_at: Date | string | null;
}

RetraitModel.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    compte_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'comptes', key: 'id' } },
    client_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'clients', key: 'id' } },
    numero_transaction: { type: DataTypes.STRING, allowNull: false, unique: true },
    montant: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    date_retrait: { type: DataTypes.DATEONLY, allowNull: false },
    mode_paiement: { type: DataTypes.STRING, allowNull: true },
    motif: { type: DataTypes.STRING, allowNull: true },
    observation: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'success' },
    created_by: { type: DataTypes.INTEGER, allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: true, get() { return modelHelpers.dateFormat(this.getDataValue("created_at")); } },
    updated_at: { type: DataTypes.DATE, allowNull: true, get() { return modelHelpers.dateFormat(this.getDataValue("updated_at")); } },
    deleted_at: { type: DataTypes.DATE, allowNull: true },
}, {
    sequelize,
    tableName: 'retraits',
    timestamps: false,
    paranoid: true,
});

RetraitModel.belongsTo(CompteModel, { foreignKey: 'compte_id', as: 'compte' });
RetraitModel.belongsTo(ClientModel, { foreignKey: 'client_id', as: 'client' });

export default RetraitModel;