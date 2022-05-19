import TSVFileReader from '../common/file-reader/tsv-file-reader.js';
import {CliCommandInterface} from './cli-command.interface.js';
import {createOffer} from '../utils/offer.js';
import ConsoleLoggerService from '../common/logger/console-logger.service.js';
import DatabaseService from '../common/database/databse.service.js';
import OfferService from '../modules/offer/offer.service.js';
import {DatabaseInterface} from '../common/database/database.interface.js';
import {OfferServiceInterface} from '../modules/offer/offer-service.interface.js';
import {OfferModel} from '../modules/offer/offer.entity.js';
import {ConfigInterface} from '../common/config/config.interface.js';
import ConfigService from '../common/config/config.service.js';
import {createURI} from '../utils/db.js';
import UserService from '../modules/user/user.service.js';
import {UserModel} from '../modules/user/user.entity.js';
import {Offer} from '../types/offer.type.js';


export default class ImportCommand implements CliCommandInterface {
  public readonly name = 'import';

  private logger = new ConsoleLoggerService();
  private databaseService!: DatabaseInterface;
  private configService!: ConfigInterface;
  private offerService!: OfferServiceInterface;
  private userService!: UserService;

  constructor() {
    this.onRow = this.onRow.bind(this);
    this.onEnd = this.onEnd.bind(this);

    this.databaseService = new DatabaseService(this.logger);
    this.configService = new ConfigService(this.logger);
    this.offerService = new OfferService(OfferModel, this.logger);
    this.userService = new UserService(UserModel, this.logger);
  }

  public async execute(fileName: string): Promise<void> {
    const uri = createURI(
      this.configService.get('DB_USER'),
      this.configService.get('DB_PASSWORD'),
      this.configService.get('DB_HOST'),
      this.configService.get('DB_PORT'),
      this.configService.get('DB_NAME'),
    );

    await this.databaseService.connect(uri);

    const fileReader = new TSVFileReader(fileName.trim());

    fileReader.on('row', this.onRow);
    fileReader.on('end', this.onEnd);

    try {
      await fileReader.read();
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error;
      }

      this.logger.error(`Не удалось импортировать данные из файла по причине: «${error.message}»`);
    }
  }

  private async saveOffer(offer: Offer): Promise<void> {
    const user = await this.userService.findOrCreate(
      offer.author,
      this.configService.get('SALT')
    );

    await this.offerService.create({
      ...offer,
      author: user.id
    });
  }

  private async onRow(row: string, resolve: () => void): Promise<void> {
    const newOffer = createOffer(row);
    await this.saveOffer(newOffer);
    resolve();
  }

  private onEnd(count: number): void {
    this.logger.info(`${count} строк импортировано`);
    this.databaseService.disconnect();
  }
}
