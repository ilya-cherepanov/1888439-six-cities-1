import typegoose, {getModelForClass, Ref, defaultClasses} from '@typegoose/typegoose';
import {Bedrooms, Guests, OfferDescription, OfferTitle, Price, Rating} from '../../consts.js';
import {City} from '../../types/city.enum.js';
import {Good} from '../../types/good.enum.js';
import {HousingType} from '../../types/housing-type.enum.js';
import {UserEntity} from '../user/user.entity.js';


const {modelOptions, prop} = typegoose;


@modelOptions({
  schemaOptions: {
    collection: 'offers',
  }
})
class OfferEntity extends defaultClasses.TimeStamps {
  constructor() {
    super();
  }

  @prop({
    required: true,
    minlength: OfferTitle.Min,
    maxlength: OfferTitle.Max,
    default: '',
  })
  public title!: string;

  @prop({
    required: true,
    minlength: OfferDescription.Min,
    maxlength: OfferDescription.Max,
    default: '',
  })
  public description!: string;

  @prop({
    required: true,
    default: new Date(),
  })
  public date!: Date;

  @prop({
    required: true,
    enum: City,
    default: '',
  })
  public city!: City;

  @prop({
    required: true,
    default: '',
  })
  public previewImage!: string;

  @prop({
    required: true,
    type: () => String,
    default: [],
  })
  public images!: string[];

  @prop({
    required: true,
    default: false,
  })
  public isPremium!: boolean;

  @prop({
    required: true,
    min: Rating.Min,
    max: Rating.Max,
    default: 0,
  })
  public rating!: number;

  @prop({
    required: true,
    enum: HousingType,
    default: '',
  })
  public type!: HousingType;

  @prop({
    required: true,
    min: Bedrooms.Min,
    max: Bedrooms.Max,
    default: 0,
  })
  public bedrooms!: number;

  @prop({
    required: true,
    min: Guests.Min,
    max: Guests.Max,
    default: 0,
  })
  public maxGuests!: number;

  @prop({
    required: true,
    min: Price.Min,
    max: Price.Max,
    default: 0,
  })
  public price!: number;

  @prop({
    required: true,
    enum: Good,
    type: () => String,
    default: [],
  })
  public goods!: Good[];

  @prop({
    required: true,
    ref: () => UserEntity,
    _id: false,
  })
  public author!: Ref<UserEntity>;

  @prop({
    required: true,
    default: 0,
  })
  public comments!: number;

  @prop({
    required: true,
    default: {
      latitude: 0,
      longitude: 0,
    },
  })
  public location!: {
    latitude: number;
    longitude: number;
  };
}


const OfferModel = getModelForClass(OfferEntity);


export {OfferEntity, OfferModel};
