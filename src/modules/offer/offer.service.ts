import 'reflect-metadata';
import {DocumentType, ReturnModelType} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';
import {ObjectId} from 'mongoose';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {Component} from '../../types/componets.js';
import CreateOfferDTO from './dto/create-offer.dto.js';
import {OfferServiceInterface} from './offer-service.interface.js';
import {OfferEntity} from './offer.entity.js';
import UpdateOfferDTO from './dto/update-offer.dto.js';


@injectable()
export default class OfferService implements OfferServiceInterface {
  constructor(
    @inject(Component.OfferModel) private readonly offerModel: ReturnModelType<typeof OfferEntity>,
    @inject(Component.LoggerInterface) private logger: LoggerInterface
  ) {}

  public async create(dto: CreateOfferDTO): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: '${dto.title}'`);

    return result;
  }

  public async findAll(count: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find({}).sort({date: -1}).limit(count).exec();
  }

  public async findById(id: ObjectId | string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(id).exec();
  }

  public async updateById(id: ObjectId | string, dto: UpdateOfferDTO): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(id, dto).exec();
  }

  public async deleteById(id: ObjectId | string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndRemove(id).exec();
  }

  public async findPremium(count: number): Promise<DocumentType<OfferEntity>[] | null> {
    return this.offerModel.find({isPremium: true}).sort({date: -1}).limit(count).exec();
  }
}
