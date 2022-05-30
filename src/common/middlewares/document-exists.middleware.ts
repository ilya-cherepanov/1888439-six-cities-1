import {Request, Response, NextFunction} from 'express';
import {StatusCodes} from 'http-status-codes';
import {DocumentExistsInterface} from '../../types/document-exists.interface.js';
import {MiddlewareInterface} from '../../types/middleware.interface.js';
import HttpError from '../errors/http-error.js';


export default class DocumentExistsMiddleware implements MiddlewareInterface {
  constructor(
    private readonly service: DocumentExistsInterface,
    private readonly entityName: string,
    private readonly paramName: string,
  ) {}

  public async execute({params}: Request, _res: Response, next: NextFunction): Promise<void> {
    const documentId = params[this.paramName];

    if (!await this.service.exists(documentId)) {
      console.log('hello');
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `${this.entityName} with ${documentId} not found!`,
        'DocumentExistsMiddleware',
      );
    }

    next();
  }
}
