import { Client, CreateClientDto, UpdateClientDto } from '../entities/Client';
import { PaginatedResult, PaginationOptions } from './PaginationOptions';

export interface ClientRepository {
  findById(id: number): Promise<Client | null>;
  findAll(options: PaginationOptions): Promise<PaginatedResult<Client>>;
  search(query: string, options: PaginationOptions): Promise<PaginatedResult<Client>>;
  create(data: CreateClientDto): Promise<Client>;
  update(id: number, data: UpdateClientDto): Promise<Client>;
  delete(id: number): Promise<boolean>;
  findOrCreateDefault(): Promise<Client>;
}