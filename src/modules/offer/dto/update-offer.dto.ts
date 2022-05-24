import {
  ArrayMaxSize,
  ArrayMinSize,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested
} from 'class-validator';
import {Bedrooms, Guests, IMAGES_COUNT, OfferDescription, OfferTitle, Rating} from '../../../consts.js';
import {City} from '../../../types/city.enum.js';
import {Good} from '../../../types/good.enum.js';
import {HousingType} from '../../../types/housing-type.enum.js';
import LocationDTO from './location.dto.js';


export default class UpdateOfferDTO {
  @IsOptional()
  @MinLength(OfferTitle.Min, {message: `Minimum title length must be greater than ${OfferTitle.Min}`})
  @MaxLength(OfferTitle.Max, {message: `Maximum title length must be less than ${OfferTitle.Max}`})
  public title?: string;

  @IsOptional()
  @MinLength(OfferDescription.Min, {message: `Minimum description length must be greater than ${OfferDescription.Min}`})
  @MaxLength(OfferDescription.Max, {message: `Maximum description length must be less than ${OfferDescription.Max}`})
  public description?: string;

  @IsOptional()
  @IsDateString({}, {message: 'date must be valid ISO date'})
  public date?: Date;

  @IsOptional()
  @IsEnum(City, {message: 'city must be of City type'})
  public city?: City;

  @IsOptional()
  @IsUrl({}, {message: 'previewImage must be url'})
  public previewImage?: string;

  @IsOptional()
  @IsUrl({}, {each: true, message: 'images must be array of urls'})
  @ArrayMinSize(IMAGES_COUNT, {message: `number of images must be ${IMAGES_COUNT}`})
  @ArrayMaxSize(IMAGES_COUNT, {message: `number of images must be ${IMAGES_COUNT}`})
  public images?: string[];

  @IsOptional()
  @IsBoolean({message: 'isPremium must be of boolean type'})
  public isPremium?: boolean;

  @IsOptional()
  @IsNumber({}, {message: 'rating must be of number type'})
  @Min(Rating.Min, {message: `Minimum rating must be greater than ${Rating.Min}`})
  @Max(Rating.Max, {message: `Maximum rating must be less than ${Rating.Max}`})
  public rating?: number;

  @IsOptional()
  @IsEnum(HousingType, {message: 'type must be of HousingType type'})
  public type?: HousingType;

  @IsOptional()
  @IsInt({message: 'bedrooms must be of integer type'})
  @Min(Bedrooms.Min, {message: `Minimum bedrooms must be greater than ${Bedrooms.Min}`})
  @Max(Bedrooms.Max, {message: `Maximum bedrooms must be less than ${Bedrooms.Max}`})
  public bedrooms?: number;

  @IsOptional()
  @IsInt({message: 'maxGuests must be of integer type'})
  @Min(Guests.Min, {message: `Minimum maxGuests must be greater than ${Guests.Min}`})
  @Max(Guests.Max, {message: `Maximum maxGuests must be less than ${Guests.Max}`})
  public maxGuests?: number;

  @IsOptional()
  @IsInt({message: 'price must be of integer type'})
  public price?: number;

  @IsOptional()
  @IsEnum(Good, {each: true, message: 'goods must be of Good[] type'})
  public goods?: Good[];

  @IsOptional()
  @IsMongoId({message: 'author must be of MongoId type'})
  public author?: string;

  @IsOptional()
  @ValidateNested()
  public location?: LocationDTO;
}
