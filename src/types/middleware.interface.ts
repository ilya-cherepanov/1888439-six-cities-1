import {NextFunction, Request, Response} from 'express';


export interface MiddlewareInterface {
  execute(this: MiddlewareInterface, req: Request, res: Response, next: NextFunction): void;
}
