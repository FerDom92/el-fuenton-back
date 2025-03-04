import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDefaultClient1741025057266 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert default client
    await queryRunner.query(`
      INSERT INTO clients (id, name, last_name, email)
      VALUES (1, 'Sin cliente', 'Default', 'sin-cliente@cliente.com')
      ON CONFLICT (id) DO NOTHING
    `);

    // Reset the sequence if needed
    await queryRunner.query(`
      SELECT setval('clients_id_seq', (SELECT MAX(id) FROM clients))
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove the default client
    await queryRunner.query(`DELETE FROM clients WHERE id = 1`);
  }
}