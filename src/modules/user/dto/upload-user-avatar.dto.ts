import {Expose} from 'class-transformer';


export default class UploadUserAvatarDTO {
  @Expose()
  public avatar!: string;
}
