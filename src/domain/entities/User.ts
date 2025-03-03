export class User {
  constructor(
    public id: number,
    public username: string,
    public email: string,
    public role: string,
    public password?: string
  ) {}
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface UserRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserDto): Promise<User>;
}