import {DocumentType} from '@typegoose/typegoose';
import {ObjectId} from 'mongoose';
import CreateOfferDTO from './dto/create-offer.dto';
import UpdateOfferDTO from './dto/update-offer.dto';
import {OfferEntity} from './offer.entity';


export interface OfferServiceInterface {
  create(dto: CreateOfferDTO): Promise<DocumentType<OfferEntity>>;
  findAll(count: number): Promise<DocumentType<OfferEntity>[]>;
  findById(id: ObjectId | string): Promise<DocumentType<OfferEntity> | null>;
  updateById(id: ObjectId | string, dto: UpdateOfferDTO): Promise<DocumentType<OfferEntity> | null>;
  deleteById(id: ObjectId | string): Promise<DocumentType<OfferEntity> | null>;
  findPremium(count: number): Promise<DocumentType<OfferEntity>[] | null>;
}
