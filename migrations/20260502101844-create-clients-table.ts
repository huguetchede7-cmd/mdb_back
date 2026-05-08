import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
    await queryInterface.createTable('clients', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        // Informations personnelles
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        birth_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        gender: {
            type: DataTypes.ENUM('M', 'F'),
            allowNull: true,
        },

        // Coordonnées
        address: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        neighborhood: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        district: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'Cotonou',
        },
        primary_phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        secondary_phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // Pièce d'identité
        id_document_type: {
            type: DataTypes.ENUM('cni', 'passport', 'permis', 'carte_consulaire', 'acte_naissance'),
            allowNull: true,
        },
        id_document_number: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },

        // Informations d'adhésion
        member_number: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        join_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },

        // Photo
        photo: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        profession: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // Métadonnées
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    });
}

export async function down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('clients');
}