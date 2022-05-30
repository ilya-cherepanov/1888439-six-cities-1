import 'reflect-metadata';
import {inject, injectable} from 'inversify';
import Controller from '../../common/controller/controller.js';
import {Component} from '../../types/components.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {Request, Response} from 'express';
import UserService from './user.service.js';
import CreateUserDTO from './dto/create-user.dto.js';
import {StatusCodes} from 'http-status-codes';
import ConfigService from '../../common/config/config.service.js';
import {fillDTO} from '../../utils/other.js';
import UserDTO from './dto/user.dto.js';
import HttpError from '../../common/errors/http-error.js';
import LoginUserDTO from './dto/login-user.dto.js';
import ValidateObjectIdMiddleware from '../../common/middlewares/validate-objectid.middleware.js';
import UploadFileMiddleware from '../../common/middlewares/upload-file.middleware.js';
import ValidateDTOMiddleware from '../../common/middlewares/validate-dto.middleware.js';


@injectable()
export default class UserController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.UserServiceInterface) private readonly userService: UserService,
    @inject(Component.ConfigInterface) private readonly config: ConfigService
  ) {
    super(logger);

    this.logger.info('Register routes for UserController…');

    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.loginUser,
      middlewares: [new ValidateDTOMiddleware(LoginUserDTO)]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkUser,
    });
    this.addRoute({
      path: '/logout',
      method: HttpMethod.Delete,
      handler: this.logoutUser,
    });
    this.addRoute({
      path: '/sign-up',
      method: HttpMethod.Post,
      handler: this.createUser,
      middlewares: [new ValidateDTOMiddleware(CreateUserDTO)],
    });
    this.addRoute({
      path: '/users/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.config.get('UPLOAD_FILE_DIRECTORY'), 'avatar'),
      ],
    });
  }

  public async loginUser(
    {body}: Request<unknown, unknown, LoginUserDTO>,
    _res: Response
  ): Promise<void> {
    const user = await this.userService.findByEmail(body.email);

    if (!user) {
      const errorMessage = `User with email ${body.email} not found!`;
      throw new HttpError(StatusCodes.UNAUTHORIZED, errorMessage, 'UserController');
    }

    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented!', 'UserController');
  }

  public async checkUser(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented!', 'UserController');
  }

  public async logoutUser(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented!', 'UserController');
  }

  public async createUser(
    {body}: Request<unknown, unknown, CreateUserDTO>,
    res: Response
  ): Promise<void> {
    const existingUser = await this.userService.findByEmail(body.email);

    if (existingUser) {
      const errorMessage = `User with email '${body.email}' already exists.`;
      throw new HttpError(StatusCodes.BAD_REQUEST, errorMessage, 'UserController');
    }

    const result = await this.userService.create(body, this.config.get('SALT'));
    this.created(res, fillDTO(UserDTO, result));
  }

  public async uploadAvatar(req: Request, res: Response): Promise<void> {
    this.created(res, {
      filepath: req.file?.path,
    });
  }
}
