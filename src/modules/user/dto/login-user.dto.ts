import {IsEmail, IsString, MaxLength, MinLength} from 'class-validator';
import {Password} from '../../../consts.js';


export default class LoginUserDTO {
  @IsEmail({}, {message: 'not valid email'})
  public email!: string;

  @IsString({message: 'password is required'})
  @MinLength(Password.MinLength, {message: `password length must be at least ${Password.MinLength} characters`})
  @MaxLength(Password.MaxLength, {message: `password length must be less than ${Password.MaxLength} characters`})
  public password!: string;
}
