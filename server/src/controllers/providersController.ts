import { Request, Response } from 'express';
import { ProviderService } from '../services/providerService';

export class ProviderController {
  constructor(private providerService: ProviderService) {}

  async getAll(req: Request, res: Response) {
    try {
      const providers = await this.providerService.getAllProviders();
      res.status(200).json(providers);
    } catch (error) {
      res.status(500).json({ message: 'Error obteniendo proveedores', error });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const provider = await this.providerService.createProvider(req.body);
      res.status(201).json(provider);
    } catch (error) {
      res.status(500).json({ message: 'Error creando proveedor', error });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await this.providerService.deleteProvider(Number(req.params.id));
      res.status(200).json({ message: 'Proveedor eliminado correctamente' });
    } catch (error: any) {
      res.status(500).json({
        message: error.message || 'Error eliminando proveedor'
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const provider = await this.providerService.getProviderById(Number(req.params.id));
      if (!provider)
        return res.status(404).json({ message: 'No se encontró el proveedor' });

      res.status(200).json(provider);
    } catch (error) {
      res.status(500).json({ message: 'Error obteniendo proveedor', error });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const provider = await this.providerService.updateProvider(
        Number(req.params.id),
        req.body
      );
      res.status(200).json(provider);
    } catch (error) {
      res.status(500).json({ message: 'Error actualizando proveedor', error });
    }
  }
}
