import {City} from '../../../types/city.enum.js';
import {Good} from '../../../types/good.enum.js';
import {HousingType} from '../../../types/housing-type.enum.js';


export default class CreateOfferDTO {
  public title!: string;
  public description!: string;
  public date!: string;
  public city!: City;
  public previewImage!: string;
  public images!: string[];
  public isPremium!: boolean;
  public rating!: number;
  public type!: HousingType;
  public bedrooms!: number;
  public maxGuests!: number;
  public price!: number;
  public goods!: Good[];
  public author!: string;
  public comments = 0;
  public location!: {
    latitude: number,
    longitude: number
  };
}
