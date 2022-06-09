import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {MiddlewareInterface} from '../../types/middleware.interface.js';
import HttpError from '../errors/http-error.js';


export default class CheckUploadAvatarAccessMiddleware implements MiddlewareInterface {
  public async execute(
    {params: {userId}, ...req}: Request<{userId: string}>,
    _res: Response,
    next: NextFunction
  ): Promise<void> {
    if (req.user.id !== userId) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        `It's forbidden to put an avatar to the user with id ${userId}`,
        'UserController'
      );
    }

    return next();
  }
}
