import { DataTypes } from 'sequelize';
import sequelize from '../config/db';
import he from 'he';
import modelHelpers from '../app/helpers/modelHelpers';

export const NotificationTypeModel = sequelize.define('NotificationTypeModel', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },

    label: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('label');
            if (!rawValue) {
                return null
            }
            return he.decode(rawValue);
        }
    },

    tag: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    icon: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            const img = this.getDataValue('icon');
            if (img && img.indexOf('http') !== -1) {
                return img;
            }
            return `${process.env.AWS_S3_BUCKET_PREFIX}/${img}`;
        }
    },

    created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },

    updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    deleted_at: {
        allowNull: true,
        type: DataTypes.DATE,
        defaultValue: null
    }
}, {
    tableName: 'notification_type',
    timestamps: false,
    paranoid: true,
    defaultScope: {
         ...modelHelpers.defaultScope,
    }
});

