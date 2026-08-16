import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import { ACCOUNT_TYPES, AccountTypeModel } from './AccountTypeModel';
import AdminRoleModel from './AdminRoleModel';        // ← Important
import modelHelpers from '../app/helpers/modelHelpers';
import he from 'he';
import FileHelpers from '../app/helpers/fileHelpers';

// Define attributes for the UserModel
interface UserAttributes {
    id?: number;
    username?: string | null;
    firstname?: string | null;
    lastname?: string | null;
    fullname?: string | null;
    avatar?: string;
    email?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
    client_ref?: string | null;
    ban_statut?: boolean;
    kyc?: '-1' | '0' | '1';
    account_type?: number | null;
    jwt_token?: string | null;
    fcm_token?: string | null;
    email_verified_at: Date | string | null;
    phone_verified_at: Date | string | null;
    created_by?: number | null;
    created_at: Date | string | null;
    updated_at: Date | string | null;
    password?: string | null;
    deleted_at: Date | string | null;
    admin_role_id?: number | null;
}

class UserModel extends Model<UserAttributes> implements UserAttributes {
    public id!: number;
    public username!: string | null;
    public firstname!: string | null;
    public lastname!: string | null;
    public fullname!: string | null;
    public avatar!: string;
    public email!: string | null;
    public phone!: string | null;
    public whatsapp!: string | null;
    public client_ref!: string | null;
    public ban_statut!: boolean;
    public kyc!: '-1' | '0' | '1';
    public account_type!: number | null;
    public jwt_token!: string | null;
    public fcm_token!: string | null;
    public email_verified_at!: Date | string | null;
    public phone_verified_at!: Date | string | null;
    public created_by!: number | null;
    public created_at!: Date | string | null;
    public updated_at!: Date | string | null;
    public password!: string | null;
    public deleted_at!: Date | string | null;
    public admin_role_id?: number | null;

    public toJSON!: () => Omit<UserAttributes, 'id' | 'password' | 'jwt_token'>;
}

UserModel.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    fullname: {
        type: DataTypes.VIRTUAL,
        get() {
            const firstname = this.getDataValue('firstname') ?? '';
            const lastname = this.getDataValue('lastname') ?? '';
            const full = `${firstname} ${lastname}`.trim();
            return full ? he.decode(full) : null;
        },
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "default_profil.jpg",
        get() {
            return FileHelpers.formatToUrl(this.getDataValue('avatar') ?? "");
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
        unique: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
        unique: true,
    },
    whatsapp: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
    },
    client_ref: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
    unique: true,
    },
    ban_statut: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    kyc: {
        type: DataTypes.ENUM('-1', '0', '1'),
        allowNull: false,
        defaultValue: '-1',
    },
    account_type: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: ACCOUNT_TYPES.CLIENT,
        references: {
            model: AccountTypeModel,
            key: 'id',
        },
    },
    jwt_token: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    fcm_token: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    email_verified_at: {
        type: DataTypes.DATE,
        allowNull: true,
        get() {
            return modelHelpers.dateFormat(this.getDataValue("email_verified_at"));
        },
    },
    phone_verified_at: {
        type: DataTypes.DATE,
        allowNull: true,
        get() {
            return modelHelpers.dateFormat(this.getDataValue("phone_verified_at"));
        },
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        get() {
            return modelHelpers.dateFormat(this.getDataValue("created_at"));
        },
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        get() {
            return modelHelpers.dateFormat(this.getDataValue("updated_at"));
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
        get() {
            return modelHelpers.dateFormat(this.getDataValue("deleted_at"));
        },
    },
    admin_role_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
}, {
    sequelize,
    tableName: 'users',
    timestamps: false,
    paranoid: true,
    defaultScope: {
        ...modelHelpers.defaultScope,
    },
});

// ==================== ASSOCIATIONS ====================
UserModel.belongsTo(AccountTypeModel, { foreignKey: 'account_type', as: 'account_type_detail' });
UserModel.belongsTo(UserModel, { foreignKey: 'created_by', as: 'creator' });

// Relation avec le rôle Admin
UserModel.belongsTo(AdminRoleModel, { 
    foreignKey: 'admin_role_id', 
    as: 'role' 
});

export default UserModel;