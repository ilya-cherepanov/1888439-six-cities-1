import 'reflect-metadata';
import {injectable, inject} from 'inversify';
import Controller from '../../common/controller/controller.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {Component} from '../../types/components.js';
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
import DocumentExistsMiddleware from '../../common/middlewares/document-exists.middleware.js';
import {FavoriteServiceInterface} from '../favorite/favorite-service.interface.js';


type GetOfferParams = {
  offerId: string
};


@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
    @inject(Component.FavoriteServiceInterface) private readonly favoriteService: FavoriteServiceInterface,
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
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
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
    const extendedOffers = await Promise.all(offers.map(
      async (offer) => ({
        ...offer.toObject(),
        isFavorite: await this.favoriteService.getFavoriteStatus(offer.id, null),
      })
    ));

    this.send(res, StatusCodes.OK, fillDTO(OfferDTO, extendedOffers));
  }

  public async createOffer(
    {body}: Request<unknown, unknown, CreateOfferDTO>,
    res: Response,
  ): Promise<void> {
    const newOffer = await this.offerService.create(body);
    const extendedOffer = {
      ...newOffer.toObject(),
      isFavorite: false,
    };

    this.ok(res, fillDTO(OfferDTO, extendedOffer));
  }

  public async getOneOffer(
    {params: {offerId}}: Request<GetOfferParams>,
    res: Response
  ): Promise<void> {
    const offer = await this.offerService.findById(offerId);
    const extendedOffer = {
      ...offer?.toObject(),
      isFavorite: await this.favoriteService.getFavoriteStatus(offer?.id, null)
    };

    this.ok(res, fillDTO(OfferDTO, extendedOffer));
  }

  public async updateOffer(
    {params: {offerId}, body}: Request<GetOfferParams, unknown, UpdateOfferDTO>,
    res: Response,
  ): Promise<void> {
    const updatedOffer = await this.offerService.updateById(offerId, body);
    const extendedOffer = {
      ...updatedOffer?.toObject(),
      isFavorite: await this.favoriteService.getFavoriteStatus(updatedOffer?.id, null)
    };

    this.ok(res, fillDTO(OfferDTO, extendedOffer));
  }

  public async deleteOffer(
    {params: {offerId}}: Request<GetOfferParams>,
    res: Response
  ): Promise<void> {
    await this.offerService.deleteById(offerId);

    this.noContent(res);
  }

  public async getPremiumOffers(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findPremium(MAX_PREMIUM_COUNT);
    const extendedOffers = await Promise.all(offers.map(
      async (offer) => ({
        ...offer.toObject(),
        isFavorite: await this.favoriteService.getFavoriteStatus(offer.id, null),
      })
    ));

    this.ok(res, fillDTO(OfferDTO, extendedOffers));
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
