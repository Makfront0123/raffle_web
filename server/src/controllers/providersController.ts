import { Request, Response } from 'express';
import { ProviderService } from '../services/providerService';

export class ProviderController {
  constructor(private providerService: ProviderService) { }

  getAll = async (req: Request, res: Response) => {
    try {
      const providers = await this.providerService.getAllProviders();
      res.status(200).json(providers);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        message: "Error obteniendo proveedores",
        error: error.message,
      });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const provider = await this.providerService.createProvider(req.body);
      res.status(201).json(provider);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error creando el proveedor' });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.providerService.deleteProvider(Number(req.params.id));

      return res.status(200).json({
        message: 'Proveedor eliminado correctamente',
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || 'Error eliminando el proveedor',
      });
    }
  };


  getById = async (req: Request, res: Response) => {
    const provider = await this.providerService.getProviderById(
      Number(req.params.id)
    );

    if (!provider) {
      return res.status(404).json({
        message: 'No se encontró el proveedor'
      });
    }

    res.status(200).json(provider);
  };


  update = async (req: Request, res: Response) => {
    try {
      const provider = await this.providerService.updateProvider(
        Number(req.params.id),
        req.body
      );
      res.status(200).json(provider);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error actualizando el proveedor' });
    }
  };
}
