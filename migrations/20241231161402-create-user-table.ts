import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable('users', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "default_profil.jpg",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    email_verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    phone_verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ban_statut: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    kyc: {
      type: DataTypes.ENUM('-1', '0', '1'),
      allowNull: false,
      defaultValue: '-1',
    },
    account_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'account_type',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    jwt_token: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable('users');
}
