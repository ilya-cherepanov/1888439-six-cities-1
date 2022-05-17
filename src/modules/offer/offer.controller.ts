import 'reflect-metadata';
import {injectable, inject} from 'inversify';
import Controller from '../../common/controller/controller.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {Component} from '../../types/componets.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {OfferServiceInterface} from './offer-service.interface.js';
import {Request, Response} from 'express';


@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.OfferServiceInterface) public readonly offerService: OfferServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({path: '/offers', method: HttpMethod.Get, handler: this.getOffers});
    this.addRoute({path: '/offers', method: HttpMethod.Post, handler: this.createOffer});
    this.addRoute({path: '/offers/:offerId', method: HttpMethod.Get, handler: this.getOneOffer});
    this.addRoute({path: '/offers/:offerId', method: HttpMethod.Put, handler: this.updateOffer});
    this.addRoute({path: '/offers/:offerId', method: HttpMethod.Delete, handler: this.deleteOffer});
    this.addRoute({path: '/premium', method: HttpMethod.Get, handler: this.getPremiumOffers});
    this.addRoute({path: '/favorites', method: HttpMethod.Get, handler: this.getFavoriteOffers});
    this.addRoute({path: '/favorites/:offerId/:status', method: HttpMethod.Post, handler: this.changeFavoriteStatus});
  }

  public async getOffers(_req: Request, _res: Response): Promise<void> {
    throw new Error('Not implemented!');
  }

  public async createOffer(_req: Request, _res: Response): Promise<void> {
    throw new Error('Not implemented!');
  }

  public async getOneOffer(_req: Request, _res: Response): Promise<void> {
    throw new Error('Not implemented!');
  }

  public async updateOffer(_req: Request, _res: Response): Promise<void> {
    throw new Error('Not implemented!');
  }

  public async deleteOffer(_req: Request, _res: Response): Promise<void> {
    throw new Error('Not implemented!');
  }

  public async getPremiumOffers(_req: Request, _res: Response): Promise<void> {
    throw new Error('Not implemented!');
  }

  public async getFavoriteOffers(_req: Request, _res: Response): Promise<void> {
    throw new Error('Not implemented!');
  }

  public async changeFavoriteStatus(_req: Request, _res: Response): Promise<void> {
    throw new Error('Not implemented!');
  }
}
