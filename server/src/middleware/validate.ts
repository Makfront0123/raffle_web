import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

type Schemas = {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
};

export const validate =
  (schemas: Schemas) =>
    (req: Request, res: Response, next: NextFunction) => {
      const errors: any[] = [];

      if (schemas.body) {
        const result = schemas.body.safeParse(req.body);
        if (!result.success) {
          errors.push({ body: result.error.flatten() });
        } else {
          req.body = result.data;
        }
      }

      if (schemas.params) {
        const result = schemas.params.safeParse(req.params);
        if (!result.success) {
          errors.push({ params: result.error.flatten() });
        } else {
          req.params = result.data as any; // 👈 fix
        }
      }

      if (schemas.query) {
        const result = schemas.query.safeParse(req.query);
        if (!result.success) {
          errors.push({ query: result.error.flatten() });
        } else {
          req.query = result.data as any; // 👈 fix
        }
      }

      if (errors.length > 0) {
        return res.status(400).json({
          message: "Validation error",
          errors,
        });
      }

      next();
    };