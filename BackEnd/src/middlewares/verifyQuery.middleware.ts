import joi, { ObjectSchema } from "joi";
import { Request, Response, NextFunction } from "express";
import logger from "../logs/logger.log";

const validateQuery = (schema: ObjectSchema) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.query);
      next();
    } catch (error: any) {
      logger.error(error.message);
      next(error);
    }
  };
};

const query = {
  get: joi.object({
    limit: joi.number().integer().min(0).max(10).label("Label"),
    page: joi.string().label("Page"),
    search: joi.string().label("Search"),
  }),
  isIp: joi.object({
    is: joi.string().required().label("is"),
    ip: joi.string().required().label("ip"),
  }),
};

export { validateQuery, query };
