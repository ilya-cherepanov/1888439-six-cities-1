import typegoose, {getModelForClass, defaultClasses} from '@typegoose/typegoose';
import {UserName} from '../../consts.js';
import {UserType} from '../../types/user-type.enum.js';
import {User} from '../../types/user.type.js';
import {getSHA256} from '../../utils/cryptography.js';

const {prop, modelOptions} = typegoose;

@modelOptions({
  schemaOptions: {
    collection: 'users',
  },
})
class UserEntity extends defaultClasses.TimeStamps {
  constructor(data: User) {
    super();

    this.name = data.name;
    this.email = data.email;
    this.userType = data.userType;
    this.avatar = data.avatar;
  }

  @prop({
    required: true,
    minlength: UserName.MinLength,
    maxlength: UserName.MaxLength,
    trim: true,
    default: ''
  })
  public name!: string;

  @prop({
    unique: true,
    required: true,
    trim: true,
    default: ''
  })
  public email!: string;

  @prop({
    required: true,
    default: ''
  })
  private password!: string;

  @prop({})
  public avatar?: string;

  @prop({
    required: true,
    enum: UserType,
    default: UserType.Regular
  })
  public userType!: UserType;

  public setPassword(password: string, salt: string): void {
    this.password = getSHA256(password, salt);
  }

  public getPassword(): string {
    return this.password;
  }
}


const UserModel = getModelForClass(UserEntity);


export {UserEntity, UserModel};
