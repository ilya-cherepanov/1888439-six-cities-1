import {Expose, Transform, Type} from 'class-transformer';
import UserDTO from '../../user/dto/user.dto.js';


export default class OfferDTO {
  @Expose()
  @Transform((value) => value.obj._id.toString())
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose()
  public date!: string;

  @Expose()
  public city!: string;

  @Expose()
  public previewImage!: string;

  @Expose()
  public images!: string[];

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public type!: string;

  @Expose()
  public bedrooms!: number;

  @Expose()
  public maxGuests!: number;

  @Expose()
  public price!: number;

  @Expose()
  public goods!: string[];

  @Expose()
  @Type(() => UserDTO)
  public author!: UserDTO;

  @Expose()
  public comments!: number;

  @Expose()
  public location!: {
    latitude: number;
    longitude: number;
  };
}

