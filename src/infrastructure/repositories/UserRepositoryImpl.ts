import { Repository } from 'typeorm';
import { CreateUserDto, User, UserRepository } from '../../domain/entities/User';
import { AppDataSource } from '../database/data-source';
import { UserEntity } from '../database/entities/user.entity';

export class UserRepositoryImpl implements UserRepository {
  private repository: Repository<UserEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(UserEntity);
  }

  private mapEntityToDomain(entity: UserEntity): User {
    return new User(
      entity.id,
      entity.username,
      entity.email,
      entity.role,
      entity.password
    );
  }

  async findById(id: number): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.mapEntityToDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { email } });
    return entity ? this.mapEntityToDomain(entity) : null;
  }

  async create(data: CreateUserDto): Promise<User> {
    const userEntity = this.repository.create({
      username: data.username,
      email: data.email,
      password: data.password,
      role: data.role || 'user'
    });

    const savedEntity = await this.repository.save(userEntity);
    return this.mapEntityToDomain(savedEntity);
  }
}