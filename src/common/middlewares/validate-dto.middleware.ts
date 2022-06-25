import {ClassConstructor, plainToInstance} from 'class-transformer';
import {validate} from 'class-validator';
import {Request, Response, NextFunction} from 'express';
import {MiddlewareInterface} from '../../types/middleware.interface.js';
import {transformErrors} from '../../utils/transform.js';
import ValidationError from '../errors/validation-error.js';


export default class ValidateDTOMiddleware implements MiddlewareInterface {
  constructor(private dto: ClassConstructor<object>) {}

  public async execute({body, path}: Request, _res: Response, next: NextFunction): Promise<void> {
    const dtoInstance = plainToInstance(this.dto, body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      throw new ValidationError(`Validation error: "${path}"`, transformErrors(errors));
    }

    next();
  }
}
