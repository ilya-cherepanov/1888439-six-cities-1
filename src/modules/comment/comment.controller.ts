import 'reflect-metadata';
import {injectable, inject} from 'inversify';
import Controller from '../../common/controller/controller.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {Component} from '../../types/componets.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {Request, Response} from 'express';


@injectable()
export default class CommentController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({path: '/offers/:offerId/comments', method: HttpMethod.Get, handler: this.getComments});
    this.addRoute({path: '/offers/:offerId/comments', method: HttpMethod.Post, handler: this.createComment});
  }

  public async getComments(_req: Request, _res: Response): Promise<void> {
    throw new Error('Not implemented!');
  }

  public async createComment(_req: Request, _res: Response): Promise<void> {
    throw new Error('Not implemented!');
  }
}
