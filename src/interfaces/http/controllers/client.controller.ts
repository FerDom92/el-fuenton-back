import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ClientService } from '../../../application/services/ClientService';
import { ClientRepositoryImpl } from '../../../infrastructure/repositories/ClientRepositoryImpl';

const clientRepository = new ClientRepositoryImpl();
const clientService = new ClientService(clientRepository);

export class ClientController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string | undefined;

      const result = await clientService.getAllClients({ page, limit, search });

      res.json({
        items: result.items,
        total: result.total,
        totalPages: result.totalPages
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const client = await clientService.getClientById(id);

      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }

      res.json(client);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const client = await clientService.createClient({
        name: req.body.name,
        lastName: req.body.lastName,
        email: req.body.email
      });

      res.status(201).json(client);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const id = parseInt(req.params.id);
      const client = await clientService.updateClient(id, {
        name: req.body.name,
        lastName: req.body.lastName,
        email: req.body.email
      });

      res.json(client);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const success = await clientService.deleteClient(id);

      if (!success) {
        return res.status(404).json({ message: 'Client not found' });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const clientController = new ClientController();