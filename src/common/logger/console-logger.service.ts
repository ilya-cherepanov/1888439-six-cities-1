import {injectable} from 'inversify';
import pino from 'pino';
import {LoggerInterface} from './logger.interface';


@injectable()
export default class ConsoleLoggerService implements LoggerInterface {
  private logger = pino();

  info(message: string, ...args: unknown[]): void {
    this.logger.info(message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    this.logger.warn(message, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    this.logger.error(message, ...args);
  }

  debug(message: string, ...args: unknown[]): void {
    this.logger.debug(message, ...args);
  }
}
