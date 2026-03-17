import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable('admin_logs', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },

    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
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
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });
}


export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable('admin_logs');
}
