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
import {createJWT} from '../../utils/cryptography.js';
import {JWT_ALGORITHM} from '../../consts.js';
import PrivateRouteMiddleware from '../../common/middlewares/private-route.middleware.js';
import CreatedUserDTO from './dto/created-user.dto.js';
import UploadUserAvatarDTO from './dto/upload-user-avatar.dto.js';


@injectable()
export default class UserController extends Controller {
  constructor(
    @inject(Component.UserServiceInterface) private readonly userService: UserService,
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) config: ConfigService
  ) {
    super(logger, config);

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
      middlewares: [new PrivateRouteMiddleware()],
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
    res: Response
  ): Promise<void> {
    const user = await this.userService.verifyUser(body, this.config.get('SALT'));

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized!',
        'UserController'
      );
    }

    const token = await createJWT(
      JWT_ALGORITHM,
      this.config.get('JWT_SECRET'),
      {email: user.email, id: user.id},
    );

    this.ok(res, {email: user.email, token});
  }

  public async checkUser(req: Request, res: Response): Promise<void> {
    const user = await this.userService.findById(req.user.id);

    this.ok(res, fillDTO(UserDTO, user));
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

    const createdUser = await this.userService.create(body, this.config.get('SALT'));
    this.created(res, fillDTO(CreatedUserDTO, createdUser));
  }

  public async uploadAvatar({params: {userId}, ...req}: Request<{userId: string}>, res: Response): Promise<void> {
    const uploadedFile = {avatar: req.file?.filename};
    await this.userService.updateById(userId, uploadedFile);

    this.created(res, fillDTO(UploadUserAvatarDTO, uploadedFile));
  }
}
