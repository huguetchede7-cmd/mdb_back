import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
    await queryInterface.createTable('clients', {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },

        // Informations personnelles
        nom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        prenom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date_naissance: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        sexe: {
            type: DataTypes.ENUM('Homme', 'Femme', 'Autre'),
            allowNull: true,
        },

        // Coordonnées
        adresse: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        quartier: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        arrondissement: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        ville: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Cotonou',
        },

        telephone_principal: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        telephone_secondaire: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // Pièce d'identité
        type_piece: {
            type: DataTypes.ENUM('CNI', 'Passeport', 'Carte Electeur', 'Permis de conduire', 'Autre'),
            allowNull: true,
        },
        numero_piece: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },

        // Informations d'adhésion
        numero_membre: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        date_adhesion: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        type_compte: {
            type: DataTypes.ENUM('Epargne Classique', 'Tontine', 'Dépôt à Vue', 'DAT', 'Groupe', 'Autre'),
            allowNull: true,
        },
        statut: {
            type: DataTypes.ENUM('Actif', 'Inactif', 'Bloqué', 'Prospect'),
            allowNull: false,
            defaultValue: 'Actif',
        },

        // Autres
        photo: {
            type: DataTypes.STRING,
            allowNull: true,        // chemin de la photo
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
    });
}

export async function down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('clients');
}