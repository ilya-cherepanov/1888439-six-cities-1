import {IsEmail, IsEnum, IsString, MaxLength, MinLength} from 'class-validator';
import {Password, UserName} from '../../../consts.js';
import {UserType} from '../../../types/user-type.enum.js';


export default class CreateUserDTO {
  @IsString({message: 'name is required'})
  @MinLength(UserName.MinLength, {message: `name length must be at least ${UserName.MinLength} characters`})
  @MaxLength(UserName.MaxLength, {message: `password length must be less than ${UserName.MaxLength} characters`})
  public name!: string;

  @IsEmail({}, {message: 'not valid email'})
  public email!: string;

  @IsString({message: 'password is required'})
  @MinLength(Password.MinLength, {message: `password length must be at least ${Password.MinLength} characters`})
  @MaxLength(Password.MaxLength, {message: `password length must be less than ${Password.MaxLength} characters`})
  public password!: string;

  @IsEnum(UserType, {message: 'userType must be of UserType type'})
  public userType!: UserType;
}
