import {NextFunction, Request, Response} from 'express';


export interface ExceptionFilterInterface {
  catch(error: Error, _req: Request, res: Response, _next: NextFunction): void;
}
