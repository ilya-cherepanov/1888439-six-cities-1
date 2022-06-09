import {Request, Response, NextFunction} from 'express';
import {MiddlewareInterface} from '../../types/middleware.interface.js';


export default class InjectUserIdMiddleware implements MiddlewareInterface {
  constructor(private readonly fieldToInject: string) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    req.body[this.fieldToInject] = req.user.id;

    return next();
  }
}
