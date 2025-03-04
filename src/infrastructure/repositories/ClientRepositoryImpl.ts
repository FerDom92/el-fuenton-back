import { Like, Repository } from 'typeorm';
import { Client, CreateClientDto, UpdateClientDto } from '../../domain/entities/Client';
import { ClientRepository } from '../../domain/repositories/ClientRepository';
import { PaginatedResult, PaginationOptions } from '../../domain/repositories/PaginationOptions';
import { AppDataSource } from '../database/data-source';
import { ClientEntity } from '../database/entities/client.entity';

export class ClientRepositoryImpl implements ClientRepository {
  private repository: Repository<ClientEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(ClientEntity);
  }

  private mapEntityToDomain(entity: ClientEntity): Client {
    return new Client(
      entity.id,
      entity.name,
      entity.lastName,
      entity.email
    );
  }

  async findById(id: number): Promise<Client | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.mapEntityToDomain(entity) : null;
  }

  async findAll(options: PaginationOptions): Promise<PaginatedResult<Client>> {
    const [entities, total] = await this.repository.findAndCount({
      skip: (options.page - 1) * options.limit,
      take: options.limit,
      order: { id: 'DESC' },
    });

    const items = entities.map(entity => this.mapEntityToDomain(entity));
    const totalPages = Math.ceil(total / options.limit);

    return {
      items,
      total,
      totalPages,
    };
  }

  async search(query: string, options: PaginationOptions): Promise<PaginatedResult<Client>> {
    const [entities, total] = await this.repository.findAndCount({
      where: [
        { name: Like(`%${query}%`) },
        { lastName: Like(`%${query}%`) },
        { email: Like(`%${query}%`) },
      ],
      skip: (options.page - 1) * options.limit,
      take: options.limit,
      order: { id: 'DESC' },
    });

    const items = entities.map(entity => this.mapEntityToDomain(entity));
    const totalPages = Math.ceil(total / options.limit);

    return {
      items,
      total,
      totalPages,
    };
  }

  async create(data: CreateClientDto): Promise<Client> {
    const clientEntity = this.repository.create({
      name: data.name,
      lastName: data.lastName,
      email: data.email,
    });

    const savedEntity = await this.repository.save(clientEntity);
    return this.mapEntityToDomain(savedEntity);
  }

  async update(id: number, data: UpdateClientDto): Promise<Client> {
    const existingClient = await this.repository.findOne({ where: { id } });

    if (!existingClient) {
      throw new Error(`Client with ID ${id} not found`);
    }

    const updatedEntity = this.repository.merge(existingClient, {
      name: data.name !== undefined ? data.name : existingClient.name,
      lastName: data.lastName !== undefined ? data.lastName : existingClient.lastName,
      email: data.email !== undefined ? data.email : existingClient.email,
    });

    const savedEntity = await this.repository.save(updatedEntity);
    return this.mapEntityToDomain(savedEntity);
  }

  async delete(id: number): Promise<boolean> {
    if (id === 1) {
      throw new Error('Cannot delete the default client');
    }

    const result = await this.repository.delete(id);
    return result.affected !== null && result.affected !== undefined && result.affected > 0;
  }

  async findOrCreateDefault(): Promise<Client> {
    const defaultClientId = 1;
    let defaultClient = await this.repository.findOne({ where: { id: defaultClientId } });

    if (!defaultClient) {
      defaultClient = this.repository.create({
        id: defaultClientId,
        name: process.env.DEFAULT_CLIENT_NAME || 'Walk-in Customer',
        lastName: process.env.DEFAULT_CLIENT_LASTNAME || 'Default',
        email: process.env.DEFAULT_CLIENT_EMAIL || 'default@example.com',
      });

      await this.repository.save(defaultClient);
    }

    return this.mapEntityToDomain(defaultClient);
  }
}