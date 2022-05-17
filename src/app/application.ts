import express from 'express';
import {inject, injectable} from 'inversify';
import {ConfigInterface} from '../common/config/config.interface.js';
import {ControllerInterface} from '../common/controller/controller.interface.js';
import {DatabaseInterface} from '../common/database/database.interface.js';
import {ExceptionFilterInterface} from '../common/errors/exception-filter.interface.js';
import {LoggerInterface} from '../common/logger/logger.interface.js';
import {Component} from '../types/componets.js';
import {createURI} from '../utils/db.js';


@injectable()
export default class Application {
  private expressApp = express();

  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.ConfigInterface) private readonly config: ConfigInterface,
    @inject(Component.DatabaseInterface) private readonly database: DatabaseInterface,
    @inject(Component.ExceptionFilterInterface) private readonly exceptionFilter: ExceptionFilterInterface,
    @inject(Component.UserController) private readonly userController: ControllerInterface,
    @inject(Component.OfferController) private readonly offerController: ControllerInterface,
    @inject(Component.CommentController) private readonly commentController: ControllerInterface,
  ) {}

  private registerRoutes(): void {
    this.expressApp.use('/', this.userController.router);
    this.expressApp.use('/', this.offerController.router);
    this.expressApp.use('/', this.commentController.router);
  }

  private registerMiddleware(): void {
    this.expressApp.use(express.json());
  }

  private registerExceptionFilters(): void {
    this.expressApp.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  public async init(): Promise<void> {
    this.logger.info('Application initialization...');

    const dbURI = createURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME')
    );

    await this.database.connect(dbURI);

    this.registerMiddleware();
    this.registerRoutes();
    this.registerExceptionFilters();
    this.expressApp.listen(this.config.get('PORT'));
    this.logger.info(`Server started on http://localhost:${this.config.get('PORT')}`);
  }
}
