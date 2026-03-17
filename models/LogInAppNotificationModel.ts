import { DataTypes } from 'sequelize';
import sequelize from '../config/db';
import modelHelpers from '../app/helpers/modelHelpers';
import he from 'he';
import {NotificationTypeModel} from './NotificationTypeModel';

const LogInAppNotificationModel = sequelize.define('LogInAppNotificationModel', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('title');
            if (!rawValue) {
                return null
            }
            return he.decode(rawValue);
        }
    },
    metadata: {
        type: DataTypes.STRING,
        allowNull: true
    },
    short_description: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('short_description');
            if (!rawValue) {
                return null
            }
            return he.decode(rawValue);
        }
    },
    description: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('description');
            if (!rawValue) {
                return null
            }
            return he.decode(rawValue);
        }
    },
    main_img: {
        type: DataTypes.STRING,
        allowNull: true,
        get() {
            const img = this.getDataValue('main_img');
            if (!img) {
                return ""
            }
            if (img && img.indexOf('http') !== -1) {
                return img;
            }
            return `${process.env.AWS_S3_BUCKET_PREFIX}/${img}`;
        }
    },
    tag_icon: {
        type: DataTypes.STRING,
        allowNull: true,
        get() {
            const img = this.getDataValue('tag_icon');
            if (!img) {
                return ""
            }
            if (img && img.indexOf('http') !== -1) {
                return img;
            }
            return `${process.env.AWS_S3_BUCKET_PREFIX}/${img}`;
        }
    },
    to_user: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
            model: 'users',
            key: 'id',
        },
        allowNull: false,
    },
    notification_type: {
        type: DataTypes.INTEGER,
        references: {
            model: 'notification_type',
            key: 'id',
        },
        allowNull: false,
    },
    statut: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            isIn: [[-1, 0, 1]],
        },
    },
    viewed_at: {
        allowNull: true,
        type: DataTypes.DATE,
        defaultValue: null,
        get() { return modelHelpers.dateFormat(this.getDataValue("viewed_at")) }
    },
    readed_at: {
        allowNull: true,
        type: DataTypes.DATE,
        defaultValue: null,
        get() { return modelHelpers.dateFormat(this.getDataValue("readed_at")) }
    },
    archived_at: {
        allowNull: true,
        type: DataTypes.DATE,
        defaultValue: null,
        get() { return modelHelpers.dateFormat(this.getDataValue("archived_at")) }
    },
    created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        get() { return modelHelpers.dateFormat(this.getDataValue("created_at")) }
    },
    updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        get() { return modelHelpers.dateFormat(this.getDataValue("updated_at")) }
    },
    deleted_at: {
        allowNull: true,
        type: DataTypes.DATE,
        defaultValue: null,
        get() { return modelHelpers.dateFormat(this.getDataValue("deleted_at")) }
    }
}, {
    tableName: 'log_inapp_notification',
    timestamps: false,
    paranoid: true,
    defaultScope: {
        ...modelHelpers.defaultScope
    }
});

LogInAppNotificationModel.belongsTo(NotificationTypeModel, { foreignKey: 'notification_type', as: 'log_notification_type_detail' });

export {LogInAppNotificationModel}