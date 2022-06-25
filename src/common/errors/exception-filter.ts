import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {inject, injectable} from 'inversify';
import {Component} from '../../types/components.js';
import {ServiceError} from '../../types/service-error.enum.js';
import {ValidationErrorField} from '../../types/validation-error-field.type.js';
import {LoggerInterface} from '../logger/logger.interface.js';
import {ExceptionFilterInterface} from './exception-filter.interface.js';
import HttpError from './http-error.js';
import ValidationError from './validation-error.js';


@injectable()
export default class ExceptionFilter implements ExceptionFilterInterface {
  constructor(@inject(Component.LoggerInterface) private readonly logger: LoggerInterface) {
    this.logger.info('Register ExceptionFilter');
  }

  private handleHttpError(error: HttpError, _req: Request, res: Response, _next: NextFunction): void {
    this.logger.error(`[${error.details}]: ${error.httpStatusCode} — ${error.message}`);
    res
      .status(error.httpStatusCode)
      .json(ExceptionFilter.createErrorObject(
        ServiceError.CommonError,
        error.message,
      ));
  }

  private handleUnknownError(error: Error, _req: Request, res: Response, _next: NextFunction): void {
    this.logger.error(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ExceptionFilter.createErrorObject(
        ServiceError.ServiceError,
        error.message,
      ));
  }

  private handleValidationError(error: ValidationError, _req: Request, res: Response, _next: NextFunction): void {
    this.logger.error(`[Validation Error]: ${error.message}`);
    error.details.forEach(
      (errorField) => this.logger.error(`[${errorField.property}] — ${errorField.messages}`)
    );

    res
      .status(StatusCodes.BAD_REQUEST)
      .json(ExceptionFilter.createErrorObject(
        ServiceError.ValidationError,
        error.message,
        error.details,
      ));
  }

  public catch(error: Error, req: Request, res: Response, next: NextFunction): void {
    if (error instanceof HttpError) {
      return this.handleHttpError(error, req, res, next);
    } else if (error instanceof ValidationError) {
      return this.handleValidationError(error, req, res, next);
    }

    this.handleUnknownError(error, req, res, next);
  }

  public static createErrorObject(serviceError: ServiceError, message: string, details: ValidationErrorField[] = []) {
    return {
      errorType: serviceError,
      message,
      details: [...details],
    };
  }
}
