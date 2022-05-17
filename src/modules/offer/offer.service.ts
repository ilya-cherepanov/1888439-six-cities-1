import 'reflect-metadata';
import {DocumentType, ReturnModelType} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';
import {ObjectId} from 'mongoose';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {Component} from '../../types/componets.js';
import CreateOfferDTO from './dto/create-offer.dto.js';
import {OfferServiceInterface} from './offer-service.interface.js';
import {OfferEntity} from './offer.entity.js';


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

  public async findById(id: ObjectId | string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(id).exec();
  }
}
