import {Request, Response, NextFunction} from 'express';
import {StatusCodes} from 'http-status-codes';
import {inject, injectable} from 'inversify';
import {Component} from '../../types/components.js';
import {createErrorObject} from '../../utils/other.js';
import {LoggerInterface} from '../logger/logger.interface.js';
import {ExceptionFilterInterface} from './exception-filter.interface.js';
import HttpError from './http-error.js';


@injectable()
export default class ExceptionFilter implements ExceptionFilterInterface {
  constructor(@inject(Component.LoggerInterface) private readonly logger: LoggerInterface) {
    this.logger.info('Register ExceptionFilter');
  }

  private handleHttpError(error: HttpError, _req: Request, res: Response, _next: NextFunction): void {
    this.logger.error(`[${error.details}]: ${error.httpStatusCode} — ${error.message}`);
    res.status(error.httpStatusCode).json(createErrorObject(error.message));
  }

  private handleUnknownError(error: Error, _req: Request, res: Response, _next: NextFunction): void {
    this.logger.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(createErrorObject(error.message));
  }

  public catch(error: Error | HttpError, _req: Request, res: Response, _next: NextFunction): void {
    if (error instanceof HttpError) {
      this.handleHttpError(error, _req, res, _next);
      return;
    }

    this.handleUnknownError(error, _req, res, _next);
  }
}
