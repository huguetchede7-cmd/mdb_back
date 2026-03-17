import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';
import UserModel from './UserModel';
import AdminRoleModel from './AdminRoleModel';

export interface AdminRolePermissionAttributes {
  id: number;
  role_id: number;
  admin_id: number;
  created_at?: Date | string;

  admin?: UserModel;
  role?: AdminRoleModel;
}

export type AdminRolePermissionCreationAttributes = Optional<
  AdminRolePermissionAttributes,
  'id' | 'created_at'
>;

class AdminRolePermissionModel
  extends Model<
    AdminRolePermissionAttributes,
    AdminRolePermissionCreationAttributes
  >
  implements AdminRolePermissionAttributes
{
  public id!: number;
  public role_id!: number;
  public admin_id!: number;
  public created_at?: Date | string;

  public admin?: UserModel;
  public role?: AdminRoleModel;
}

AdminRolePermissionModel.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },

    role_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: AdminRoleModel,
        key: 'id',
      },
    },

    admin_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: UserModel,
        key: 'id',
      },
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'admin_role_permissions',
    timestamps: true,
    updatedAt: false,
    underscored: true,
    createdAt: 'created_at',
    indexes: [
      {
        unique: true,
        fields: ['role_id', 'admin_id'],
      },
    ],
  }
);

AdminRolePermissionModel.belongsTo(UserModel, {
  foreignKey: 'admin_id',
  as: 'admin',
});

AdminRolePermissionModel.belongsTo(AdminRoleModel, {
  foreignKey: 'role_id',
  as: 'role',
});

export default AdminRolePermissionModel;
