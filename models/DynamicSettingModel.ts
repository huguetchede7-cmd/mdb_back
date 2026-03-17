import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/db'
import modelHelpers from '../app/helpers/modelHelpers'

/**
 * Attributs principaux
 */
export interface DynamicSettingAttributes {
  id: number
  slug: string
  label: string
  description?: string | null
  value?: string | any | null
  created_at?: Date | string
  updated_at?: Date | string
  deleted_at?: Date | string | null
}

/**
 * Attributs requis à la création
 */
export type DynamicSettingCreationAttributes = Optional<
  DynamicSettingAttributes,
  'id' | 'description' | 'value' | 'created_at' | 'updated_at' | 'deleted_at'
>

/**
 * Model
 */
class DynamicSettingModel
  extends Model<DynamicSettingAttributes, DynamicSettingCreationAttributes>
  implements DynamicSettingAttributes
{
  public id!: number
  public slug!: string
  public label!: string
  public description?: string | null
  public value?: string | any | null
  public created_at?: Date | string
  public updated_at?: Date | string
  public deleted_at?: Date | string | null
}

DynamicSettingModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },

    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'Clé unique du paramètre',
    },

    label: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Libellé affiché',
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Description du paramètre',
    },

    value: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
      comment: 'Valeur du paramètre (string ou JSON)',
      get() {
        const raw = this.getDataValue('value')
        try {
          return raw ? JSON.parse(raw) : null
        } catch {
          return raw
        }
      },
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
    tableName: 'dynamic_settings',
    timestamps: true,
    paranoid: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    defaultScope: {
      ...modelHelpers.defaultScope,
    },
    indexes: [
      { unique: true, fields: ['slug'] },
    ],
  }
)

export default DynamicSettingModel
