import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1741025002357 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create products table
    await queryRunner.query(`
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        detail VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create clients table
    await queryRunner.query(`
      CREATE TABLE clients (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create sales table
    await queryRunner.query(`
      CREATE TABLE sales (
        id SERIAL PRIMARY KEY,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        client_id INTEGER NOT NULL REFERENCES clients(id),
        total DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create sale_items table
    await queryRunner.query(`
      CREATE TABLE sale_items (
        id SERIAL PRIMARY KEY,
        sale_id INTEGER NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
        product_id INTEGER NOT NULL REFERENCES products(id),
        quantity INTEGER NOT NULL,
        unit_price DECIMAL(10,2) NOT NULL,
        total DECIMAL(10,2) NOT NULL
      )
    `);

    // Add index to improve search performance
    await queryRunner.query(`CREATE INDEX idx_products_name ON products(name)`);
    await queryRunner.query(`CREATE INDEX idx_clients_name ON clients(name)`);
    await queryRunner.query(`CREATE INDEX idx_clients_email ON clients(email)`);
    await queryRunner.query(`CREATE INDEX idx_sales_date ON sales(date)`);
    await queryRunner.query(`CREATE INDEX idx_sales_client_id ON sales(client_id)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS sale_items`);
    await queryRunner.query(`DROP TABLE IF EXISTS sales`);
    await queryRunner.query(`DROP TABLE IF EXISTS clients`);
    await queryRunner.query(`DROP TABLE IF EXISTS products`);
  }
}