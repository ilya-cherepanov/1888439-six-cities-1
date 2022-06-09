import {Request, Response, NextFunction} from 'express';
import { StatusCodes } from 'http-status-codes';
import {OfferServiceInterface} from '../../modules/offer/offer-service.interface.js';
import {MiddlewareInterface} from '../../types/middleware.interface.js';
import HttpError from '../errors/http-error.js';


export default class CheckOfferOwnerMiddleware implements MiddlewareInterface {
  constructor(private readonly offerService: OfferServiceInterface) {}

  public async execute(
    {params: {offerId}, ...req}: Request<{offerId: string}>,
    _res: Response,
    next: NextFunction,
  ): Promise<void> {
    const offer = await this.offerService.findById(offerId);
    if (offer?.author?.toString() !== req.user.id) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        `Forbidden to change the offer with id ${offerId}`,
        'CheckOfferOwnerMiddleware');
    }

    return next();
  }
}
