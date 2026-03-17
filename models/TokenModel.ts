import { DataTypes } from 'sequelize';
import sequelize from '../config/db';
import modelHelpers from '../app/helpers/modelHelpers';
import UserModel from "./UserModel";

const TokenModel = sequelize.define('TokenModel', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: UserModel,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
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
    tableName: 'tokens',
    timestamps: false,
    paranoid: true, // This will enable the soft deletes
    defaultScope: {
        ...modelHelpers.defaultScope
    }
});

// Format dates
TokenModel.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    // Exclude sensitive fields
    delete values.id;
    return values;
};

const TOKEN_TYPES = {
    EMAIL_VERIFICATION: 1,
    PASSWORD_RESET: 2
}

// Define associations
TokenModel.belongsTo(UserModel, {foreignKey: 'user_id',as: 'user',});

export { TokenModel, TOKEN_TYPES };
