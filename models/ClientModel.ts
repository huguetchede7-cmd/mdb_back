import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import modelHelpers from '../app/helpers/modelHelpers';

interface ClientAttributes {
    id?: number;
    last_name: string;
    first_name: string;
    birth_date?: string | null;
    gender?: string | null;
    address?: string | null;
    neighborhood?: string | null;
    district?: string | null;
    city?: string | null;
    primary_phone: string;
    secondary_phone?: string | null;
    id_document_type?: string | null;
    id_document_number?: string | null;
    profession?: string | null;
    member_number?: string | null;
    join_date?: string | null;
    status?: string | null;
    photo?: string | null;
    created_by?: number | null;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
}

class ClientModel extends Model<ClientAttributes> implements ClientAttributes {
    declare id: number;
    declare last_name: string;
    declare first_name: string;
    declare birth_date: string | null;
    declare gender: string | null;
    declare address: string | null;
    declare neighborhood: string | null;
    declare district: string | null;
    declare city: string | null;
    declare primary_phone: string;
    declare secondary_phone: string | null;
    declare id_document_type: string | null;
    declare id_document_number: string | null;
    declare profession: string | null;
    declare member_number: string | null;
    declare join_date: string | null;
    declare status: string | null;
    declare photo: string | null;
    declare created_by: number | null;
    declare created_at: Date | string | null;
    declare updated_at: Date | string | null;
    declare deleted_at: Date | string | null;
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
    city: { type: DataTypes.STRING, allowNull: true, defaultValue: 'Cotonou' },
    primary_phone: { type: DataTypes.STRING, allowNull: false },
    secondary_phone: { type: DataTypes.STRING, allowNull: true },
    id_document_type: { type: DataTypes.STRING, allowNull: true },
    id_document_number: { type: DataTypes.STRING, allowNull: true, unique: true },
    profession: { type: DataTypes.STRING, allowNull: true },
    member_number: { type: DataTypes.STRING, allowNull: true, unique: true },
    join_date: { type: DataTypes.DATEONLY, allowNull: true },
    status: { type: DataTypes.STRING, allowNull: true, defaultValue: 'active' },
    photo: { type: DataTypes.STRING, allowNull: true },
    created_by: { type: DataTypes.INTEGER, allowNull: true },
    created_at: {
        type: DataTypes.DATE, allowNull: true,
        get() { return modelHelpers.dateFormat(this.getDataValue("created_at")); }
    },
    updated_at: {
        type: DataTypes.DATE, allowNull: true,
        get() { return modelHelpers.dateFormat(this.getDataValue("updated_at")); }
    },
    deleted_at: { type: DataTypes.DATE, allowNull: true },
}, {
    sequelize,
    tableName: 'clients',
    timestamps: false,
    paranoid: true,
});

export default ClientModel;