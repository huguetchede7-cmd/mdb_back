'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('admin_roles', [
      {
        title: 'Administrateur',
        slug: 'admin',
        description: 'Accès total au système',
        icon: 'shield',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Chargé d\'Épargne',
        slug: 'savings_officer',
        description: 'Gestion des clients, comptes épargne et tontines',
        icon: 'users',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Caissier',
        slug: 'cashier',
        description: 'Effectue les dépôts, retraits et opérations de caisse',
        icon: 'credit-card',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('admin_roles', null, {});
  }
};