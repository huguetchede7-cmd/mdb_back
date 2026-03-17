import { QueryInterface, DataTypes, Sequelize } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable('log_inapp_notification', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    metadata: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    short_description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    main_img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tag_icon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    to_user: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
      allowNull: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    notification_type: {
      type: DataTypes.INTEGER,
      references: {
        model: 'notification_type',
        key: 'id',
      },
      allowNull: true,
    },
    statut: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isIn: [[-1, 0, 1]],
      },
    },
    readed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    archived_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const down = async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  await queryInterface.dropTable('log_inapp_notification');
};
