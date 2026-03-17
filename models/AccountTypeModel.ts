import { DataTypes } from 'sequelize';
import sequelize from '../config/db';
import modelHelpers from '../app/helpers/modelHelpers';

const AccountTypeModel = sequelize.define('AccountTypeModel', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    label: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tag: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    deleted_at: {
        type: DataTypes.DATE,
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
    },
}, {
    tableName: 'account_type',
    timestamps: false,
    paranoid: true, // This will enable the soft deletes
    defaultScope: {
        ...modelHelpers.defaultScope
    }
});

// Format dates
AccountTypeModel.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    // Exclude sensitive fields
    delete values.id;

    return values;
};

const ACCOUNT_TYPES = {
    ADMIN: 1,
    CLIENT: 2,
}

export { AccountTypeModel, ACCOUNT_TYPES };
