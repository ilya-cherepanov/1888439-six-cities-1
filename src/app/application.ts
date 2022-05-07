import {inject, injectable} from 'inversify';
import {ConfigInterface} from '../common/config/config.interface.js';
import {DatabaseInterface} from '../common/database/database.interface.js';
import {LoggerInterface} from '../common/logger/logger.interface.js';
import {Component} from '../types/componets.js';
import {createURI} from '../utils/db.js';


@injectable()
export default class Application {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.ConfigInterface) private config: ConfigInterface,
    @inject(Component.DatabaseInterface) private database: DatabaseInterface,
  ) {}

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
  }
}
