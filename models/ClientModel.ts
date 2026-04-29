import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import modelHelpers from '../app/helpers/modelHelpers';

interface ClientAttributes {
    id?: number;
    last_name: string;
    first_name: string;
    birth_date?: string | null;
    gender?: 'M' | 'F' | null;
    address?: string | null;
    neighborhood?: string | null;
    district?: string | null;
    city?: string | null;
    primary_phone: string;
    secondary_phone?: string | null;
    member_number?: string | null;
    join_date?: string | null;
    account_type?: string | null;
    status?: 'active' | 'inactive';
    id_document_type?: string | null;
    id_document_number?: string | null;
    created_by?: number | null;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
}

class ClientModel extends Model<ClientAttributes> implements ClientAttributes {
    public id!: number;
    public last_name!: string;
    public first_name!: string;
    public birth_date!: string | null;
    public gender!: 'M' | 'F' | null;
    public address!: string | null;
    public neighborhood!: string | null;
    public district!: string | null;
    public city!: string | null;
    public primary_phone!: string;
    public secondary_phone!: string | null;
    public member_number!: string | null;
    public join_date!: string | null;
    public account_type!: string | null;
    public status!: 'active' | 'inactive';
    public id_document_type!: string | null;
    public id_document_number!: string | null;
    public created_by!: number | null;
    public created_at!: Date | string | null;
    public updated_at!: Date | string | null;
    public deleted_at!: Date | string | null;
}

ClientModel.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    last_name: { type: DataTypes.STRING, allowNull: false },
    first_name: { type: DataTypes.STRING, allowNull: false },
    birth_date: { type: DataTypes.DATEONLY, allowNull: true },
    gender: { type: DataTypes.ENUM('M', 'F'), allowNull: true },
    address: { type: DataTypes.STRING, allowNull: true },
    neighborhood: { type: DataTypes.STRING, allowNull: true },
    district: { type: DataTypes.STRING, allowNull: true },
    city: { type: DataTypes.STRING, allowNull: true },
    primary_phone: { type: DataTypes.STRING, allowNull: false },
    secondary_phone: { type: DataTypes.STRING, allowNull: true },
    member_number: { type: DataTypes.STRING, allowNull: true, unique: true },
    join_date: { type: DataTypes.DATEONLY, allowNull: true },
    account_type: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.ENUM('active', 'inactive'), allowNull: false, defaultValue: 'active' },
    id_document_type: { type: DataTypes.STRING, allowNull: true },
    id_document_number: { type: DataTypes.STRING, allowNull: true },
    created_by: { type: DataTypes.INTEGER, allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: true, get() { return modelHelpers.dateFormat(this.getDataValue("created_at")); } },
    updated_at: { type: DataTypes.DATE, allowNull: true, get() { return modelHelpers.dateFormat(this.getDataValue("updated_at")); } },
    deleted_at: { type: DataTypes.DATE, allowNull: true },
}, {
    sequelize,
    tableName: 'clients',
    timestamps: false,
    paranoid: true,
});

export default ClientModel;