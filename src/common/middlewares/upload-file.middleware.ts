import {Request, Response, NextFunction} from 'express';
import {MiddlewareInterface} from '../../types/middleware.interface.js';
import multer, {diskStorage} from 'multer';
import mime from 'mime';
import {nanoid} from 'nanoid';
import {SUPPORTED_IMAGE_FORMATS} from '../../consts.js';
import HttpError from '../errors/http-error.js';
import {StatusCodes} from 'http-status-codes';


export default class UploadFileMiddleware implements MiddlewareInterface {
  constructor(
    private readonly uploadDirectory: string,
    private readonly fieldName: string,
  ) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const storage = diskStorage({
      destination: this.uploadDirectory,
      filename: (_req, file, callback) => {
        const extension = mime.extension(file.mimetype);
        const filename = nanoid();
        callback(null, `${filename}.${extension}`);
      }

    });

    const uploadSingleFileMiddleware = multer({
      storage,
      fileFilter: (_req, file, callback) => {
        if (!SUPPORTED_IMAGE_FORMATS.includes(file.mimetype)) {
          return callback(new HttpError(
            StatusCodes.BAD_REQUEST,
            'Unsupported image format',
            'UploadFileMiddleware'
          ));
        }

        callback(null, true);
      }
    }).single(this.fieldName);

    uploadSingleFileMiddleware(req, res, next);
  }
}
