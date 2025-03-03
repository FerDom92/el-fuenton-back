import { Client, CreateClientDto, UpdateClientDto } from '../../domain/entities/Client';
import { ClientRepository } from '../../domain/repositories/ClientRepository';
import { PaginatedResult, PaginationOptions } from '../../domain/repositories/PaginationOptions';

export class ClientService {
  constructor(private clientRepository: ClientRepository) {}

  async getClientById(id: number): Promise<Client | null> {
    return this.clientRepository.findById(id);
  }

  async getAllClients(options: PaginationOptions): Promise<PaginatedResult<Client>> {
    if (options.search) {
      return this.clientRepository.search(options.search, options);
    }
    return this.clientRepository.findAll(options);
  }

  async createClient(data: CreateClientDto): Promise<Client> {
    return this.clientRepository.create(data);
  }

  async updateClient(id: number, data: UpdateClientDto): Promise<Client> {
    return this.clientRepository.update(id, data);
  }

  async deleteClient(id: number): Promise<boolean> {
    return this.clientRepository.delete(id);
  }

  async findOrCreateDefaultClient(): Promise<Client> {
    return this.clientRepository.findOrCreateDefault();
  }
}