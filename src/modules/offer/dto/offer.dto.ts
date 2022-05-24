import {Expose, Transform} from 'class-transformer';


export default class OfferDTO {
  @Expose()
  @Transform((value) => value.obj.id.toString())
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
  @Transform((value) => value.obj.author.toString())
  public author!: string;

  @Expose()
  public comments!: number;

  @Expose()
  public location!: {
    latitude: number;
    longitude: number;
  };
}

