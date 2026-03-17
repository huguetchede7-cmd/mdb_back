import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  const notificationTypeData = [
    { id: 1, label: 'Connexion', tag: 'login', icon: 'default_notif.png', created_at: new Date(), updated_at: new Date() },
    { id: 2, label: 'Déconnexion', tag: 'logout', icon: 'default_notif.png', created_at: new Date(), updated_at: new Date() },
    { id: 3, label: "Création d'annonce", tag: 'poste_create', icon: 'default_notif.png', created_at: new Date(), updated_at: new Date() },
    { id: 4, label: 'Annonce vérifiée', tag: 'poste_verified', icon: 'default_notif.png', created_at: new Date(), updated_at: new Date() },
    { id: 5, label: 'Annonce rejetée', tag: 'poste_rejected', icon: 'default_notif.png', created_at: new Date(), updated_at: new Date() },
    { id: 6, label: 'Vente effectué', tag: 'selling', icon: 'default_notif.png', created_at: new Date(), updated_at: new Date() },
    { id: 7, label: 'Inscription', tag: 'register', icon: 'default_notif.png', created_at: new Date(), updated_at: new Date() },
    { id: 8, label: 'Profil rejeté', tag: 'register_rejected', icon: 'default_notif.png', created_at: new Date(), updated_at: new Date() },
    { id: 9, label: 'Profil vérifié', tag: 'register_validated', icon: 'default_notif.png', created_at: new Date(), updated_at: new Date() },
  ];

  // Vérifier chaque enregistrement individuellement pour éviter les doublons
  for (const data of notificationTypeData) {
    const existingRecord = await queryInterface.rawSelect('notification_type', {
      where: { tag: data.tag }
    }, ['id']);
    
    if (!existingRecord) {
      await queryInterface.bulkInsert('notification_type', [data]);
    }
  }
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.bulkDelete('notification_type', {}, {});
}
