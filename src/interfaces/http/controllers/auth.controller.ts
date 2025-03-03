import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthService } from '../../../application/services/AuthService';
import { UserRepositoryImpl } from '../../../infrastructure/repositories/UserRepositoryImpl';

const userRepository = new UserRepositoryImpl();
const authService = new AuthService(userRepository);

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const result = await authService.register({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
      });

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const result = await authService.login({
        email: req.body.email,
        password: req.body.password
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();