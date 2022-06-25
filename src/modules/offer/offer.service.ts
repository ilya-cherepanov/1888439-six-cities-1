import 'reflect-metadata';
import {DocumentType, ReturnModelType} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';
import {ObjectId} from 'mongoose';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {Component} from '../../types/components.js';
import CreateOfferDTO from './dto/create-offer.dto.js';
import {OfferServiceInterface} from './offer-service.interface.js';
import {OfferEntity} from './offer.entity.js';
import UpdateOfferDTO from './dto/update-offer.dto.js';
import {SortType} from '../../consts.js';


@injectable()
export default class OfferService implements OfferServiceInterface {
  constructor(
    @inject(Component.OfferModel) private readonly offerModel: ReturnModelType<typeof OfferEntity>,
    @inject(Component.LoggerInterface) private logger: LoggerInterface
  ) {}

  public async exists(offerId: ObjectId | string): Promise<boolean> {
    return await this.offerModel.exists({_id: offerId}).exec() !== null;
  }

  public async create(dto: CreateOfferDTO): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: '${dto.title}'`);

    return result.populate('author');
  }

  public async findAll(count: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find({}).sort({createdAt: SortType.Down}).limit(count).populate('author').exec();
  }

  public async findById(offerId: ObjectId | string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).populate('author').exec();
  }

  public async updateById(offerId: ObjectId | string, dto: UpdateOfferDTO): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(offerId, dto, {new: true}).populate('author').exec();
  }

  public async deleteById(offerId: ObjectId | string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndRemove(offerId).exec();
  }

  public async findPremium(count: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find({isPremium: true}).sort({createdAt: SortType.Down}).limit(count).populate('author').exec();
  }

  public async incCommentsById(offerId: ObjectId | string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(offerId, {
      '$inc': {comments: 1}
    }).exec();
  }
}
