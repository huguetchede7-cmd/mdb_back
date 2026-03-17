import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  const accountTypeData = [
    { id: 1, label: 'Administrateur', tag: 'admin', created_at: new Date(), updated_at: new Date() },
    { id: 2, label: 'Client', tag: 'client', created_at: new Date(), updated_at: new Date() },
  ];

  // Vérifier chaque enregistrement individuellement pour éviter les doublons
  for (const data of accountTypeData) {
    const existingRecord = await queryInterface.rawSelect('account_type', {
      where: { tag: data.tag }
    }, ['id']);
    
    if (!existingRecord) {
      await queryInterface.bulkInsert('account_type', [data]);
    }
  }
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.bulkDelete('account_type', {}, {});
}
