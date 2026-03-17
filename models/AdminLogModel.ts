import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';
import UserModel from './UserModel';
import modelHelpers from '../app/helpers/modelHelpers';

export interface AdminLogAttributes {
  id: number;
  admin_id: number | null;
  link: string;
  body: string | null;
  http_method: string;
  http_code: number;
  created_at?: Date | string;
  updated_at?: Date | string;
  deleted_at?: Date | string | null;

  admin?: UserModel;
}

export type AdminLogCreationAttributes = Optional<
  AdminLogAttributes,
  'id' | 'created_at' | 'updated_at' | 'deleted_at'
>;

class AdminLogModel
  extends Model<AdminLogAttributes, AdminLogCreationAttributes>
  implements AdminLogAttributes {
  public id!: number;
  public admin_id!: number | null;
  public body!: string | null;
  public link!: string;
  public http_method!: string;
  public http_code!: number;

  public created_at?: Date | string;
  public updated_at?: Date | string;
  public deleted_at?: Date | string | null;

  public admin?: UserModel;
}

AdminLogModel.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },

    admin_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: null,
      references: {
        model: UserModel,
        key: 'id',
      },
    },

    link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
      comment: 'Contenu de la requête (JSON)',
    },
    http_method: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },

    http_code: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    tableName: 'admin_logs',
    timestamps: true,
    paranoid: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    defaultScope: {
      ...modelHelpers.defaultScope,
    },
  }
);

AdminLogModel.belongsTo(UserModel, {
  foreignKey: 'admin_id',
  as: 'admin',
});

export default AdminLogModel;
