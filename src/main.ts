#!/usr/bin/env node

import 'reflect-metadata';
import {Container} from 'inversify';
import Application from './app/application.js';
import {ConfigInterface} from './common/config/config.interface.js';
import ConfigService from './common/config/config.service.js';
import ConsoleLoggerService from './common/logger/console-logger.service.js';
import {LoggerInterface} from './common/logger/logger.interface.js';
import {Component} from './types/components.js';
import {DatabaseInterface} from './common/database/database.interface.js';
import DatabaseService from './common/database/databse.service.js';
import {ReturnModelType} from '@typegoose/typegoose';
import {UserEntity, UserModel} from './modules/user/user.entity.js';
import {UserServiceInterface} from './modules/user/user-service.interface.js';
import UserService from './modules/user/user.service.js';
import {OfferEntity, OfferModel} from './modules/offer/offer.entity.js';
import {OfferServiceInterface} from './modules/offer/offer-service.interface.js';
import OfferService from './modules/offer/offer.service.js';
import {ControllerInterface} from './common/controller/controller.interface.js';
import UserController from './modules/user/user.controller.js';
import {ExceptionFilterInterface} from './common/errors/exception-filter.interface.js';
import ExceptionFilter from './common/errors/exception-filter.js';
import OfferController from './modules/offer/offer.controller.js';
import CommentController from './modules/comment/comment.controller.js';
import {CommentServiceInterface} from './modules/comment/comment-service.interface.js';
import CommentService from './modules/comment/comment.service.js';
import {CommentModel} from './modules/comment/comment.entity.js';
import {FavoriteModel} from './modules/favorite/favorite.entity.js';
import {FavoriteServiceInterface} from './modules/favorite/favorite-service.interface.js';
import FavoriteService from './modules/favorite/favorite.service.js';


const appContainer = new Container();
appContainer.bind<Application>(Component.Application).to(Application).inSingletonScope();
appContainer.bind<LoggerInterface>(Component.LoggerInterface).to(ConsoleLoggerService).inSingletonScope();
appContainer.bind<ConfigInterface>(Component.ConfigInterface).to(ConfigService).inSingletonScope();
appContainer.bind<DatabaseInterface>(Component.DatabaseInterface).to(DatabaseService).inSingletonScope();
appContainer.bind<ReturnModelType<typeof UserEntity>>(Component.UserModel).toConstantValue(UserModel);
appContainer.bind<UserServiceInterface>(Component.UserServiceInterface).to(UserService).inSingletonScope();
appContainer.bind<ReturnModelType<typeof OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
appContainer.bind<OfferServiceInterface>(Component.OfferServiceInterface).to(OfferService).inSingletonScope();
appContainer.bind<ExceptionFilterInterface>(Component.ExceptionFilterInterface).to(ExceptionFilter).inSingletonScope();
appContainer.bind<CommentServiceInterface>(Component.CommentServiceInterface).to(CommentService).inSingletonScope();
appContainer.bind<ReturnModelType<typeof CommentModel>>(Component.CommentModel).toConstantValue(CommentModel);
appContainer.bind<ReturnModelType<typeof FavoriteModel>>(Component.FavoriteModel).toConstantValue(FavoriteModel);
appContainer.bind<FavoriteServiceInterface>(Component.FavoriteServiceInterface).to(FavoriteService).inSingletonScope();

appContainer.bind<ControllerInterface>(Component.UserController).to(UserController).inSingletonScope();
appContainer.bind<ControllerInterface>(Component.OfferController).to(OfferController).inSingletonScope();
appContainer.bind<ControllerInterface>(Component.CommentController).to(CommentController).inSingletonScope();

const application = appContainer.get<Application>(Component.Application);
await application.init();
