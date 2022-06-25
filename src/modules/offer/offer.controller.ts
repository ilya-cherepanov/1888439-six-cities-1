import 'reflect-metadata';
import typegoose from '@typegoose/typegoose';
import {injectable, inject} from 'inversify';
import Controller from '../../common/controller/controller.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {Component} from '../../types/components.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {OfferServiceInterface} from './offer-service.interface.js';
import {Request, Response} from 'express';
import {DEFAULT_OFFERS_COUNT, MAX_PREMIUM_COUNT} from '../../consts.js';
import {fillDTO} from '../../utils/other.js';
import OfferDTO from './dto/offer.dto.js';
import CreateOfferDTO from './dto/create-offer.dto.js';
import UpdateOfferDTO from './dto/update-offer.dto.js';
import ValidateObjectIdMiddleware from '../../common/middlewares/validate-objectid.middleware.js';
import ValidateDTOMiddleware from '../../common/middlewares/validate-dto.middleware.js';
import DocumentExistsMiddleware from '../../common/middlewares/document-exists.middleware.js';
import {FavoriteServiceInterface} from '../favorite/favorite-service.interface.js';
import PrivateRouteMiddleware from '../../common/middlewares/private-route.middleware.js';
import CheckOfferOwnerMiddleware from '../../common/middlewares/check-offer-owner.middleware.js';
import InjectUserIdMiddleware from '../../common/middlewares/inject-user.middleware.js';
import {ConfigInterface} from '../../common/config/config.interface.js';
import { CommentServiceInterface } from '../comment/comment-service.interface.js';


const {isDocument} = typegoose;


type GetOfferParams = {
  offerId: string;
};


@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
    @inject(Component.FavoriteServiceInterface) private readonly favoriteService: FavoriteServiceInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) config: ConfigInterface,
  ) {
    super(logger, config);

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
      middlewares: [
        new PrivateRouteMiddleware(),
        new InjectUserIdMiddleware('author'),
        new ValidateDTOMiddleware(CreateOfferDTO),
      ],
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
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new InjectUserIdMiddleware('author'),
        new CheckOfferOwnerMiddleware(this.offerService),
        new ValidateDTOMiddleware(UpdateOfferDTO),
      ],
    });

    this.addRoute({
      path: '/offers/:offerId',
      method: HttpMethod.Delete,
      handler: this.deleteOffer,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new CheckOfferOwnerMiddleware(this.offerService),
      ],
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
      middlewares: [new PrivateRouteMiddleware(),],
    });

    this.addRoute({
      path: '/favorites/:offerId/:status',
      method: HttpMethod.Post,
      handler: this.changeFavoriteStatus,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
  }

  public async getOffers(
    req: Request<unknown, unknown, unknown, {count?: string}>,
    res: Response
  ): Promise<void> {
    const count = OfferController.extractCount(req);
    const offers = await this.offerService.findAll(count);

    const extendedOffers = await Promise.all(offers.map(
      async (offer) => ({
        ...offer.toObject(),
        isFavorite: await this.favoriteService.getFavoriteStatus(offer.id, req?.user?.id),
      })
    ));

    this.ok(res, fillDTO(OfferDTO, extendedOffers));
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
    {params: {offerId}, ...req}: Request<GetOfferParams>,
    res: Response
  ): Promise<void> {
    const offer = await this.offerService.findById(offerId);

    const extendedOffer = {
      ...offer?.toObject(),
      isFavorite: await this.favoriteService.getFavoriteStatus(offer?.id, req?.user?.id)
    };

    this.ok(res, fillDTO(OfferDTO, extendedOffer));
  }

  public async updateOffer(
    {params: {offerId}, body, ...req}: Request<GetOfferParams, unknown, UpdateOfferDTO>,
    res: Response,
  ): Promise<void> {
    const updatedOffer = await this.offerService.updateById(offerId, body);
    const extendedOffer = {
      ...updatedOffer?.toObject(),
      isFavorite: await this.favoriteService.getFavoriteStatus(updatedOffer?.id, req?.user?.id)
    };

    this.ok(res, fillDTO(OfferDTO, extendedOffer));
  }

  public async deleteOffer(
    {params: {offerId}}: Request<GetOfferParams>,
    res: Response
  ): Promise<void> {
    await this.offerService.deleteById(offerId);
    await this.favoriteService.deleteByOfferId(offerId);
    await this.commentService.deleteByOfferId(offerId);

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

  public async getFavoriteOffers({user}: Request, res: Response): Promise<void> {
    const favorites = await this.favoriteService.getFavorites(user.id);

    const extendedOffers = favorites.map((favorite) => {
      if (isDocument(favorite.offer)) {
        return {
          ...favorite.offer.toObject(),
          isFavorite: true,
        };
      }

      return null;
    });

    this.ok(res, fillDTO(OfferDTO, extendedOffers));
  }

  public async changeFavoriteStatus(
    {params: {offerId, status}, user}: Request<GetOfferParams & {status: string}>,
    res: Response
  ): Promise<void> {
    const newStatus = await this.favoriteService.setFavoriteStatus(
      offerId,
      user.id,
      Boolean(parseInt(status, 10)),
    );

    const offer = await this.offerService.findById(offerId);
    const extendedOffer = {...offer?.toObject(), isFavorite: newStatus};

    this.ok(res, fillDTO(OfferDTO, extendedOffer));
  }

  public static extractCount({query}: Request<unknown, unknown, unknown, {count?: string}>): number {
    if (!query.count) {
      return DEFAULT_OFFERS_COUNT;
    } else {
      const queriedCount = parseInt(query.count, 10);
      return queriedCount && queriedCount > 0 ? queriedCount : DEFAULT_OFFERS_COUNT;
    }
  }
}
