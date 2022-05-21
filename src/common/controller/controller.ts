import 'reflect-metadata';
import {injectable} from 'inversify';
import asyncHandler from 'express-async-handler';
import {ControllerInterface} from './controller.interface.js';
import {Response, Router} from 'express';
import {LoggerInterface} from '../logger/logger.interface.js';
import {RouteInterface} from '../../types/route.interface.js';
import { StatusCodes } from 'http-status-codes';


@injectable()
export default abstract class Controller implements ControllerInterface {
  private readonly _router: Router = Router();

  constructor(protected logger: LoggerInterface) {}

  get router(): Router {
    return this._router;
  }

  public addRoute(route: RouteInterface): void {
    const routeHandler = asyncHandler(route.handler.bind(this));
    const middlewares = route.middlewares?.map((middleware) => asyncHandler(middleware.execute.bind(middleware)));

    const handlers = middlewares ? [...middlewares, routeHandler] : routeHandler;

    this._router[route.method](route.path, handlers);
    this.logger.info(`Route registered: ${route.method.toUpperCase()} ${route.path}`);
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    res
      .type('application/json')
      .status(statusCode)
      .json(data);
  }

  public ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  public noContent(res: Response): void {
    this.send(res, StatusCodes.NO_CONTENT, {});
  }
}
