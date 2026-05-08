import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import modelHelpers from '../app/helpers/modelHelpers';

interface ClientAttributes {
    id?: number;
    last_name: string;
    first_name: string;
    birth_date?: string | null;
    gender?: 'Male' | 'Female' | 'Other' | null;
    
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
    
    photo?: string | null;
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
    public gender!: 'Male' | 'Female' | 'Other' | null;
    
    public address!: string | null;
    public neighborhood!: string | null;
    public district!: string | null;
    public city!: string | null;
    
    public primary_phone!: string;
    public secondary_phone!: string | null;
    
    public id_document_type!: string | null;
    public id_document_number!: string | null;
    public profession!: string | null;
    
    public member_number!: string | null;
    public join_date!: string | null;
    
    public photo!: string | null;
    public created_by!: number | null;
    
    public created_at!: Date | string | null;
    public updated_at!: Date | string | null;
    public deleted_at!: Date | string | null;
}

ClientModel.init({
    id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    last_name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    first_name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    birth_date: { 
        type: DataTypes.DATEONLY, 
        allowNull: true 
    },
    gender: { 
        type: DataTypes.ENUM('Male', 'Female', 'Other'), 
        allowNull: true 
    },
    address: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    neighborhood: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    district: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    city: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        defaultValue: 'Cotonou' 
    },
    primary_phone: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
    },
    secondary_phone: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    id_document_type: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    id_document_number: { 
        type: DataTypes.STRING, 
        allowNull: true, 
        unique: true 
    },
    profession: { type: DataTypes.STRING, allowNull: true },
    
    member_number: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
    },
    join_date: { 
        type: DataTypes.DATEONLY, 
        allowNull: false 
    },
    
    photo: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    created_by: { 
        type: DataTypes.INTEGER, 
        allowNull: true 
    },

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
    deleted_at: { 
        type: DataTypes.DATE, 
        allowNull: true 
    },
}, {
    sequelize,
    tableName: 'clients',
    timestamps: false,
    paranoid: true,
});

export default ClientModel; 