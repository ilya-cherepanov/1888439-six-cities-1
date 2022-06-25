import {Request, Response, NextFunction} from 'express';
import {MiddlewareInterface} from '../../types/middleware.interface.js';


export default class InjectOfferIdMiddleware implements MiddlewareInterface {
  constructor(private readonly fieldToInject: string) {}

  public async execute(req: Request<{offerId: string}>, _res: Response, next: NextFunction): Promise<void> {
    req.body[this.fieldToInject] = req.params.offerId;

    return next();
  }
}
