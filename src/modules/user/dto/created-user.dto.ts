import {Expose, Transform} from 'class-transformer';


export default class CreatedUserDTO {
  @Expose()
  @Transform((value) => value.obj._id.toString())
  public id!: string;

  @Expose()
  public email!: string;
}
