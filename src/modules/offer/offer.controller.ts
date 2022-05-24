import 'reflect-metadata';
import {injectable, inject} from 'inversify';
import Controller from '../../common/controller/controller.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {Component} from '../../types/componets.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {OfferServiceInterface} from './offer-service.interface.js';
import {Request, Response} from 'express';
import {DEFAULT_OFFERS_COUNT, MAX_PREMIUM_COUNT} from '../../consts.js';
import {StatusCodes} from 'http-status-codes';
import HttpError from '../../common/errors/http-error.js';
import {fillDTO} from '../../utils/other.js';
import OfferDTO from './dto/offer.dto.js';
import CreateOfferDTO from './dto/create-offer.dto.js';
import UpdateOfferDTO from './dto/update-offer.dto.js';
import ValidateObjectIdMiddleware from '../../common/middlewares/validate-objectid.middleware.js';
import ValidateDTOMiddleware from '../../common/middlewares/validate-dto.middleware.js';


type GetOfferParams = {
  offerId: string
};


@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.OfferServiceInterface) public readonly offerService: OfferServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({
      path: '/offers',
      method: HttpMethod.Get,
      handler: this.getOffers
    });
    this.addRoute({
      path: '/offers',
      method: HttpMethod.Post,
      handler: this.createOffer,
      middlewares: [new ValidateDTOMiddleware(CreateOfferDTO)],
    });
    this.addRoute({
      path: '/offers/:offerId',
      method: HttpMethod.Get,
      handler: this.getOneOffer,
      middlewares: [new ValidateObjectIdMiddleware('offerId')],
    });
    this.addRoute({
      path: '/offers/:offerId',
      method: HttpMethod.Put,
      handler: this.updateOffer,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDTOMiddleware(UpdateOfferDTO)
      ],
    });
    this.addRoute({
      path: '/offers/:offerId',
      method: HttpMethod.Delete,
      handler: this.deleteOffer,
      middlewares: [new ValidateObjectIdMiddleware('offerId')],
    });
    this.addRoute({
      path: '/premium',
      method: HttpMethod.Get,
      handler: this.getPremiumOffers,
    });
    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.getFavoriteOffers,
    });
    this.addRoute({
      path: '/favorites/:offerId/:status',
      method: HttpMethod.Post,
      handler: this.changeFavoriteStatus,
    });
  }

  public async getOffers(
    req: Request<unknown, unknown, unknown, {count?: string}>,
    res: Response
  ): Promise<void> {
    const count = this.extractCount(req);
    const offers = await this.offerService.findAll(count);

    this.send(res, StatusCodes.OK, fillDTO(OfferDTO, offers));
  }

  public async createOffer(
    {body}: Request<unknown, unknown, CreateOfferDTO>,
    res: Response,
  ): Promise<void> {
    const newOffer = await this.offerService.create(body);

    this.ok(res, fillDTO(OfferDTO, newOffer));
  }

  public async getOneOffer(req: Request<GetOfferParams>, res: Response): Promise<void> {
    const {offerId} = req.params;
    const offer = await this.offerService.findById(offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'OfferController'
      );
    }

    this.ok(res, fillDTO(OfferDTO, offer));
  }

  public async updateOffer(
    req: Request<GetOfferParams, unknown, UpdateOfferDTO>,
    res: Response,
  ): Promise<void> {
    const {offerId} = req.params;
    const updatedOffer = await this.offerService.updateById(offerId, req.body);

    if (!updatedOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'OfferController'
      );
    }

    this.ok(res, fillDTO(OfferDTO, updatedOffer));
  }

  public async deleteOffer(req: Request<GetOfferParams>, res: Response): Promise<void> {
    const {offerId} = req.params;
    const offer = await this.offerService.deleteById(offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'OfferController'
      );
    }

    this.noContent(res);
  }

  public async getPremiumOffers(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findPremium(MAX_PREMIUM_COUNT);

    this.ok(res, fillDTO(OfferDTO, offers));
  }

  public async getFavoriteOffers(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented!', 'OfferController');
  }

  public async changeFavoriteStatus(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented!', 'OfferController');
  }

  private extractCount({query}: Request<unknown, unknown, unknown, {count?: string}>): number {
    if (!query.count) {
      return DEFAULT_OFFERS_COUNT;
    } else {
      const queriedCount = parseInt(query.count, 10);
      return queriedCount && queriedCount > 0 ? queriedCount : DEFAULT_OFFERS_COUNT;
    }
  }
}
