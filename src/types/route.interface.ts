import {NextFunction, Request, Response} from 'express';
import {ControllerInterface} from '../common/controller/controller.interface.js';
import {HttpMethod} from './http-method.enum.js';
import {MiddlewareInterface} from './middleware.interface.js';


export interface RouteInterface {
  path: string;
  method: HttpMethod;
  middlewares?: MiddlewareInterface[];
  handler(this: ControllerInterface, req: Request, res: Response, next: NextFunction): void;
}
