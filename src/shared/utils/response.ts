import { NextFunction, Request, Response } from 'express';

export abstract class BaseController {
  protected sendResponse(res: Response, data: unknown, status = 200) {
    res.status(status).json(data);
  }
}
export type ControllerHandler = (
  req: Request,
  res: Response,
  next?: NextFunction,
) => Promise<void> | void;
