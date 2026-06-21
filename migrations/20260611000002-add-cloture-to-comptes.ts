import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
    await queryInterface.sequelize.query(
        `ALTER TABLE comptes MODIFY COLUMN status ENUM('active', 'inactive', 'bloque', 'cloture') NOT NULL DEFAULT 'active'`);
}

export async function down(queryInterface: QueryInterface) {
    await queryInterface.sequelize.query(
        `ALTER TABLE comptes MODIFY COLUMN status ENUM('active', 'inactive', 'bloque') NOT NULL DEFAULT 'active'`);
}
