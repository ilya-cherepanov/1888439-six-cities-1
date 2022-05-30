import {ObjectId} from 'mongoose';


export interface FavoriteServiceInterface {
  getFavoriteStatus(offerId: ObjectId | string, userId: ObjectId | string | null): Promise<boolean>;
  setFavoriteStatus(offerId: ObjectId | string, userId: ObjectId | string, status: boolean): Promise<void>;
}
