import {ObjectId} from 'mongoose';


export interface DocumentExistsInterface {
  exists(id: string | ObjectId): Promise<boolean>;
}
