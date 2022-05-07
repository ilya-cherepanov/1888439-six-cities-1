import {UserType} from '../../../types/user-type.enum';


export default class CreateUserDTO {
  public name!: string;
  public email!: string;
  public password!: string;
  public avatar?: string;
  public userType!: UserType;
}
