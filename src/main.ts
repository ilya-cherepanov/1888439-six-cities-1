#!/usr/bin/env node

import 'reflect-metadata';
import {Container} from 'inversify';
import Application from './app/application.js';
import {ConfigInterface} from './common/config/config.interface.js';
import ConfigService from './common/config/config.service.js';
import ConsoleLoggerService from './common/logger/console-logger.service.js';
import {LoggerInterface} from './common/logger/logger.interface.js';
import {Component} from './types/componets.js';
import {DatabaseInterface} from './common/database/database.interface.js';
import DatabaseService from './common/database/databse.service.js';
import {ModelType} from '@typegoose/typegoose/lib/types.js';
import {UserEntity, UserModel} from './modules/user/user.entity.js';
import {UserServiceInterface} from './modules/user/user-service.interface.js';
import UserService from './modules/user/user.service.js';
import {OfferEntity, OfferModel} from './modules/offer/offer.entity.js';
import {OfferServiceInterface} from './modules/offer/offer-service.interface.js';
import OfferService from './modules/offer/offer.service.js';


const appContainer = new Container();
appContainer.bind<Application>(Component.Application).to(Application).inSingletonScope();
appContainer.bind<LoggerInterface>(Component.LoggerInterface).to(ConsoleLoggerService).inSingletonScope();
appContainer.bind<ConfigInterface>(Component.ConfigInterface).to(ConfigService).inSingletonScope();
appContainer.bind<DatabaseInterface>(Component.DatabaseInterface).to(DatabaseService).inSingletonScope();
appContainer.bind<ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
appContainer.bind<UserServiceInterface>(Component.UserServiceInterface).to(UserService).inSingletonScope();
appContainer.bind<ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
appContainer.bind<OfferServiceInterface>(Component.OfferServiceInterface).to(OfferService).inSingletonScope();

const application = appContainer.get<Application>(Component.Application);
await application.init();
