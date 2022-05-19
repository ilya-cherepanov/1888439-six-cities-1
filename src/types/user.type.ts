import {UserType} from './user-type.enum';


export type User = {
  name: string;
  email: string;
  avatar?: string;
  userType: UserType;
  password: string;
}
