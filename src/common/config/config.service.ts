import 'reflect-metadata';
import {config} from 'dotenv';
import {inject, injectable} from 'inversify';
import {Component} from '../../types/components.js';
import {LoggerInterface} from '../logger/logger.interface.js';
import {ConfigInterface} from './config.interface.js';
import {configSchema, ConfigSchema} from './config.schema.js';


@injectable()
export default class ConfigService implements ConfigInterface {
  private config: ConfigSchema;

  constructor(@inject(Component.LoggerInterface) private logger: LoggerInterface) {
    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error('Can\'t read .env file. Perhaps the file does not exists.');
    }

    configSchema.load({});
    configSchema.validate({allowed: 'strict', output: this.logger.info});

    this.config = configSchema.getProperties();
  }

  get<T extends keyof ConfigSchema>(key: T): ConfigSchema[T] {
    return this.config[key];
  }
}
