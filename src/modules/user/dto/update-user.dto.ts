import {UserType} from '../../../types/user-type.enum.js';


export default class UpdateUserDTO {
  public name?: string;
  public avatar?: string;
  public userType?: UserType;
}
