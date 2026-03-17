import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';
import modelHelpers from '../app/helpers/modelHelpers';

interface GeneralSettingAttributes {
    id: number;
    label: string;
    value: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    deleted_at?: Date | string | null;
}

type GeneralSettingCreationAttributes = Optional<GeneralSettingAttributes, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;

class GeneralSettingModel extends Model<GeneralSettingAttributes, GeneralSettingCreationAttributes>
    implements GeneralSettingAttributes {
    public id!: number;
    public label!: string;
    public value!: string;
    public created_at?: Date | string;
    public updated_at?: Date | string;
    public deleted_at?: Date | string | null;
}

GeneralSettingModel.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        label: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        value: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
        },
    },
    {
        sequelize,
        tableName: 'general_settings',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        defaultScope: {
            ...modelHelpers.defaultScope
        },
    }
);

export default GeneralSettingModel;
