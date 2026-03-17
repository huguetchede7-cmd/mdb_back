import { DataTypes } from 'sequelize';
import sequelize from '../config/db';
import modelHelpers from '../app/helpers/modelHelpers';

const EmailLogModel = sequelize.define('EmailLogModel', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    ref: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    subject: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    from: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    to: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    data: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('data')
            return rawValue ? JSON.parse(rawValue) : null
        }
    },

    template: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        get() { return modelHelpers.dateFormat(this.getDataValue("created_at")) }
    },

    updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        get() { return modelHelpers.dateFormat(this.getDataValue("updated_at")) }
    }
}, {
    tableName: 'emails_logs',
    timestamps: false,
    paranoid: true, // This will enable the soft deletes
    defaultScope: {
         ...modelHelpers.defaultScope,
    }
});

// Format dates
EmailLogModel.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    // Exclude sensitive fields
    delete values.id;
    return values;
};

export {EmailLogModel}
