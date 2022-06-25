import 'reflect-metadata';
import {DocumentType, ReturnModelType} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';
import {ObjectId} from 'mongoose';
import CreateUserDTO from '../../modules/user/dto/create-user.dto.js';
import {UserEntity} from '../../modules/user/user.entity.js';
import {Component} from '../../types/components.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {UserServiceInterface} from '../../modules/user/user-service.interface.js';
import LoginUserDTO from './dto/login-user.dto.js';
import UpdateUserDTO from './dto/update-user.dto.js';


@injectable()
export default class UserService implements UserServiceInterface {
  constructor(
    @inject(Component.UserModel) private readonly userModel: ReturnModelType<typeof UserEntity>,
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
  ) {}

  public async create(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  public async findById(id: ObjectId | string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findById(id).exec();
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email}).exec();
  }

  public async findOrCreate(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>> {
    const user = await this.findByEmail(dto.email);

    if (user) {
      return user;
    }

    return this.create(dto, salt);
  }

  public async verifyUser(dto: LoginUserDTO, salt: string): Promise<DocumentType<UserEntity> | null> {
    const user = await this.findByEmail(dto.email);

    if (user?.verifyPassword(dto.password, salt)) {
      return user;
    }

    return null;
  }

  public async updateById(userId: string | ObjectId, update: UpdateUserDTO): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findByIdAndUpdate(userId, update, {new: true}).exec();
  }
}
