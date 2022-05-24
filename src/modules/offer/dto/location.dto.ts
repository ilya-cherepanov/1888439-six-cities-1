import {IsNumber} from 'class-validator';


export default class LocationDTO {
  @IsNumber({}, {message: 'latitude must be of number type'})
  public latitude!: number;

  @IsNumber({}, {message: 'longitude must be of number type'})
  public longitude!: number;
}
