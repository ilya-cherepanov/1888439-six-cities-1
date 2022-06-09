import {DocumentType} from '@typegoose/typegoose';
import {ObjectId} from 'mongoose';
import CreateUserDTO from './dto/create-user.dto.js';
import LoginUserDTO from './dto/login-user.dto.js';
import {UserEntity} from './user.entity.js';


export interface UserServiceInterface {
  create(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findById(id: ObjectId | string): Promise<DocumentType<UserEntity> | null>
  findOrCreate(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>>;
  verifyUser(dto: LoginUserDTO, salt: string): Promise<DocumentType<UserEntity> | null>;
}
