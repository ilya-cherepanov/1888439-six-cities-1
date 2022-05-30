import {DocumentType} from '@typegoose/typegoose';
import {ObjectId} from 'mongoose';
import {DocumentExistsInterface} from '../../types/document-exists.interface.js';
import CreateOfferDTO from './dto/create-offer.dto.js';
import UpdateOfferDTO from './dto/update-offer.dto.js';
import {OfferEntity} from './offer.entity.js';


export interface OfferServiceInterface extends DocumentExistsInterface {
  create(dto: CreateOfferDTO): Promise<DocumentType<OfferEntity>>;
  findAll(count: number): Promise<DocumentType<OfferEntity>[]>;
  findById(offerId: ObjectId | string): Promise<DocumentType<OfferEntity> | null>;
  updateById(offerId: ObjectId | string, dto: UpdateOfferDTO): Promise<DocumentType<OfferEntity> | null>;
  deleteById(offerId: ObjectId | string): Promise<DocumentType<OfferEntity> | null>;
  findPremium(count: number): Promise<DocumentType<OfferEntity>[]>;
  incCommentsById(offerId: ObjectId | string): Promise<DocumentType<OfferEntity> | null>;
}
