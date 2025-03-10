
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CreateUserDto, LoginDto, User, UserRepository } from '../../domain/entities/User';
import { BadRequestError, UnauthorizedError } from '../../domain/errors/AppError';

export class AuthService {
  constructor(private userRepository: UserRepository) { }

  async register(data: CreateUserDto): Promise<{ user: User; token: string }> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new BadRequestError('User with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
      role: data.role || 'user'
    });

    const token = this.generateToken(user);

    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword as User, token };
  }

  async login(data: LoginDto): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const validPassword = await bcrypt.compare(data.password, user.password!);
    if (!validPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = this.generateToken(user);

    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword as User, token };
  }

  private generateToken(user: User): string {
    const secretKey = process.env.JWT_SECRET || 'your-secret-key';
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      secretKey,
      { expiresIn: '24h' }
    );
  }
}