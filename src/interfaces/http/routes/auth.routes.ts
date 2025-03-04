import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { loginValidator, registerValidator } from '../validators/auth.validator';

export const authRouter = Router();

authRouter.post('/register', registerValidator, authController.register);
authRouter.post('/login', loginValidator, authController.login);