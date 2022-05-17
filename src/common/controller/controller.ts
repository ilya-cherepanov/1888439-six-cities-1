import 'reflect-metadata';
import {injectable} from 'inversify';
import asyncHandler from 'express-async-handler';
import {ControllerInterface} from './controller.interface.js';
import {Response, Router} from 'express';
import {LoggerInterface} from '../logger/logger.interface.js';
import { RouteInterface } from '../../types/route.interface.js';


@injectable()
export default abstract class Controller implements ControllerInterface {
  private readonly _router: Router = Router();

  constructor(protected logger: LoggerInterface) {}

  get router(): Router {
    return this._router;
  }

  public addRoute(route: RouteInterface): void {
    this._router[route.method](route.path, asyncHandler(route.handler.bind(this)));
    this.logger.info(`Route registered: ${route.method.toUpperCase()} ${route.path}`);
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    res
      .type('application/json')
      .status(statusCode)
      .json(data);
  }
}
