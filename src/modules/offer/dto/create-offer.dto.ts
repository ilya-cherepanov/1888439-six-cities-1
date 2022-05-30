import {
  ArrayMaxSize,
  ArrayMinSize,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNumber,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested
} from 'class-validator';
import {Bedrooms, Guests, IMAGES_COUNT, OfferDescription, OfferTitle, OfferRating} from '../../../consts.js';
import {City} from '../../../types/city.enum.js';
import {Good} from '../../../types/good.enum.js';
import {HousingType} from '../../../types/housing-type.enum.js';
import LocationDTO from './location.dto.js';


export default class CreateOfferDTO {
  @MinLength(OfferTitle.Min, {message: `Minimum title length must be greater than ${OfferTitle.Min}`})
  @MaxLength(OfferTitle.Max, {message: `Maximum title length must be less than ${OfferTitle.Max}`})
  public title!: string;

  @MinLength(OfferDescription.Min, {message: `Minimum description length must be greater than ${OfferDescription.Min}`})
  @MaxLength(OfferDescription.Max, {message: `Maximum description length must be less than ${OfferDescription.Max}`})
  public description!: string;

  @IsDateString({}, {message: 'date must be valid ISO date'})
  public date!: Date;

  @IsEnum(City, {message: 'city must be of City type'})
  public city!: City;

  @IsUrl({}, {message: 'previewImage must be url'})
  public previewImage!: string;

  @IsUrl({}, {each: true, message: 'images must be array of urls'})
  @ArrayMinSize(IMAGES_COUNT, {message: `number of images must be ${IMAGES_COUNT}`})
  @ArrayMaxSize(IMAGES_COUNT, {message: `number of images must be ${IMAGES_COUNT}`})
  public images!: string[];

  @IsBoolean({message: 'isPremium must be of boolean type'})
  public isPremium!: boolean;

  @IsNumber({}, {message: 'rating must be of number type'})
  @Min(OfferRating.Min, {message: `Minimum rating must be greater than ${OfferRating.Min}`})
  @Max(OfferRating.Max, {message: `Maximum rating must be less than ${OfferRating.Max}`})
  public rating!: number;

  @IsEnum(HousingType, {message: 'type must be of HousingType type'})
  public type!: HousingType;

  @IsInt({message: 'bedrooms must be of integer type'})
  @Min(Bedrooms.Min, {message: `Minimum bedrooms must be greater than ${Bedrooms.Min}`})
  @Max(Bedrooms.Max, {message: `Maximum bedrooms must be less than ${Bedrooms.Max}`})
  public bedrooms!: number;

  @IsInt({message: 'maxGuests must be of integer type'})
  @Min(Guests.Min, {message: `Minimum maxGuests must be greater than ${Guests.Min}`})
  @Max(Guests.Max, {message: `Maximum maxGuests must be less than ${Guests.Max}`})
  public maxGuests!: number;

  @IsInt({message: 'price must be of integer type'})
  public price!: number;

  @IsEnum(Good, {each: true, message: 'goods must be of Good[] type'})
  public goods!: Good[];

  @IsMongoId({message: 'author must be of MongoId type'})
  public author!: string;

  @ValidateNested()
  public location!: LocationDTO;
}
