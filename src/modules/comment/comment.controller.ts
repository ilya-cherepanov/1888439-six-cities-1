import 'reflect-metadata';
import {injectable, inject} from 'inversify';
import Controller from '../../common/controller/controller.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {Component} from '../../types/components.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {Request, Response} from 'express';
import {CommentServiceInterface} from './comment-service.interface.js';
import ValidateObjectIdMiddleware from '../../common/middlewares/validate-objectid.middleware.js';
import CreateCommentDTO from './dto/create-comment.dto.js';
import {OfferServiceInterface} from '../offer/offer-service.interface.js';
import DocumentExistsMiddleware from '../../common/middlewares/document-exists.middleware.js';
import {fillDTO} from '../../utils/other.js';
import CommentDTO from './dto/comment.dto.js';


type GetCommentsParams = {
  offerId: string,
};


@injectable()
export default class CommentController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController…');

    this.addRoute({
      path: '/offers/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/offers/:offerId/comments',
      method: HttpMethod.Post,
      handler: this.createComment,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
  }

  public async getComments({params: {offerId}}: Request<GetCommentsParams>, res: Response): Promise<void> {
    const comments = await this.commentService.findAllByOfferId(offerId);

    this.ok(res, fillDTO(CommentDTO, comments));
  }

  public async createComment(
    {params: {offerId}, body}: Request<GetCommentsParams, unknown, CreateCommentDTO>,
    res: Response,
  ): Promise<void> {
    const newComment = await this.commentService.create(body);
    await this.offerService.incCommentsById(offerId);

    this.created(res, fillDTO(CommentDTO, newComment));
  }
}
