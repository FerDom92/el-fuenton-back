import { Router } from 'express';
import { clientController } from '../controllers/client.controller';
import { createClientValidator, updateClientValidator } from '../validators/client.validator';

export const clientRouter = Router();

clientRouter.get('/', clientController.getAll);
clientRouter.get('/:id', clientController.getById);
clientRouter.post('/', createClientValidator, clientController.create);
clientRouter.put('/:id', updateClientValidator, clientController.update);
clientRouter.delete('/:id', clientController.delete);