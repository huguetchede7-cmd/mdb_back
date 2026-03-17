import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';
import modelHelpers from '../app/helpers/modelHelpers';

export interface AdminRoleAttributes {
  id: number;
  title: string;
  slug:string;
  description?: string | null;
  icon?: string | null;
  created_at?: Date | string;
  updated_at?: Date | string;
  deleted_at?: Date | string | null;
}

export type AdminRoleCreationAttributes = Optional<
  AdminRoleAttributes,
  'id' | 'description' | 'icon' | 'created_at' | 'updated_at' | 'deleted_at'
>;

class AdminRoleModel
  extends Model<AdminRoleAttributes, AdminRoleCreationAttributes>
  implements AdminRoleAttributes
{
  public id!: number;
  public title!: string;
  public slug!:string;
  public description?: string | null;
  public icon?: string | null;

  public created_at?: Date | string;
  public updated_at?: Date | string;
  public deleted_at?: Date | string | null;
}

AdminRoleModel.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    icon: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'admin_roles',
    timestamps: true,
    paranoid: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    defaultScope: {
      ...modelHelpers.defaultScope,
    },
    scopes: {
      orderByIdAsc: {
        order: [['id', 'ASC']],
      },
      orderByIdDesc: {
        order: [['id', 'DESC']],
      },
    },
    indexes: [{ unique: true, fields: ['title'] },{ unique: true, fields: ['slug'] }],
  }
);

export default AdminRoleModel;
