import {UserType} from './user-type.enum';


export type User = {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  password: string;
  userType: UserType;
}
