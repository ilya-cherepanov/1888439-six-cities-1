import {Expose, Transform, Type} from 'class-transformer';
import UserDTO from '../../user/dto/user.dto.js';


export default class CommentDTO {
  @Expose()
  @Transform((value) => value.obj._id.toString())
  public id!: string;

  @Expose()
  public comment!: string;

  @Expose()
  public rating!: number;

  @Expose({name: 'createdAt'})
  public date!: string;

  @Expose()
  @Type(() => UserDTO)
  public author!: UserDTO;
}
