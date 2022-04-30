#!/usr/bin/env node

import 'reflect-metadata';
import {Container} from 'inversify';
import Application from './app/application.js';
import {ConfigInterface} from './common/config/config.interface.js';
import ConfigService from './common/config/config.service.js';
import ConsoleLoggerService from './common/logger/console-logger.service.js';
import {LoggerInterface} from './common/logger/logger.interface.js';
import {Component} from './types/componets.js';


const appContainer = new Container();
appContainer.bind<Application>(Component.Application).to(Application).inSingletonScope();
appContainer.bind<LoggerInterface>(Component.LoggerInterface).to(ConsoleLoggerService).inSingletonScope();
appContainer.bind<ConfigInterface>(Component.ConfigInterface).to(ConfigService).inSingletonScope();

const application = appContainer.get<Application>(Component.Application);
application.init();
