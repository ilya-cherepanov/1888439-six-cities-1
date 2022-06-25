import {StatusCodes} from 'http-status-codes';
import {ValidationErrorField} from '../../types/validation-error-field.type.js';


export default class ValidationError extends Error {
  public httpStatusCode: number = StatusCodes.BAD_REQUEST;
  public details: ValidationErrorField[] = [];

  constructor(message: string, errors: ValidationErrorField[]) {
    super(message);

    this.details = errors;
  }
}
