import 'reflect-metadata';
import {ReturnModelType} from '@typegoose/typegoose';
import {ObjectId} from 'mongoose';
import {FavoriteServiceInterface} from './favorite-service.interface.js';
import {FavoriteEntity} from './favorite.entity.js';
import {inject, injectable} from 'inversify';
import {Component} from '../../types/components.js';


@injectable()
export default class FavoriteService implements FavoriteServiceInterface {
  constructor(
    @inject(Component.FavoriteModel) private readonly favoriteModel: ReturnModelType<typeof FavoriteEntity>,
  ) {}

  public async getFavoriteStatus(offerId: string | ObjectId, userId: string | ObjectId | null): Promise<boolean> {
    if (userId === null) {
      return false;
    }

    return await this.favoriteModel.exists({offer: offerId, user: userId}).exec() !== null;
  }

  public async setFavoriteStatus(
    offerId: string | ObjectId,
    userId: string | ObjectId,
    status: boolean,
  ): Promise<void> {
    if (status) {
      await this.favoriteModel.create({user: userId, offer: offerId});
    } else {
      await this.favoriteModel.findOneAndDelete({user: userId, offer: offerId}).exec();
    }
  }
}
