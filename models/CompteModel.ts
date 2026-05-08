import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import modelHelpers from '../app/helpers/modelHelpers';
import ClientModel from './ClientModel';

interface CompteAttributes {
    id?: number;
    client_id: number;
    numero_compte: string;
    type_compte: 'epargne_ordinaire' | 'epargne_terme' | 'courant' | 'joint';
    solde?: number;
    solde_initial?: number;
    status?: 'active' | 'inactive' | 'bloque';
    date_ouverture: string;
    created_by?: number | null;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
}

class CompteModel extends Model<CompteAttributes> implements CompteAttributes {
    public id!: number;
    public client_id!: number;
    public numero_compte!: string;
    public type_compte!: 'epargne_ordinaire' | 'epargne_terme' | 'courant' | 'joint';
    public solde!: number;
    public solde_initial!: number;
    public status!: 'active' | 'inactive' | 'bloque';
    public date_ouverture!: string;
    public created_by!: number | null;
    public created_at!: Date | string | null;
    public updated_at!: Date | string | null;
    public deleted_at!: Date | string | null;
}

CompteModel.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'clients', key: 'id' },
    },
    numero_compte: { type: DataTypes.STRING, allowNull: false, unique: true },
    type_compte: {
        type: DataTypes.ENUM('epargne_ordinaire', 'epargne_terme', 'courant', 'joint'),
        allowNull: false,
    },
    solde: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
    solde_initial: { type: DataTypes.DECIMAL(15, 2), allowNull: true, defaultValue: 0 },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'bloque'),
        allowNull: false,
        defaultValue: 'active',
    },
    date_ouverture: { type: DataTypes.DATEONLY, allowNull: false },
    created_by: { type: DataTypes.INTEGER, allowNull: true },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        get() { return modelHelpers.dateFormat(this.getDataValue("created_at")); }
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        get() { return modelHelpers.dateFormat(this.getDataValue("updated_at")); }
    },
    deleted_at: { type: DataTypes.DATE, allowNull: true },
}, {
    sequelize,
    tableName: 'comptes',
    timestamps: false,
    paranoid: true,
});

CompteModel.belongsTo(ClientModel, { foreignKey: 'client_id', as: 'client' });
ClientModel.hasMany(CompteModel, { foreignKey: 'client_id', as: 'comptes' });

export default CompteModel;