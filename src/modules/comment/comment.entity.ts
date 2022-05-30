import typegoose, {defaultClasses, getModelForClass, Ref} from '@typegoose/typegoose';
import {Comment, CommentRating} from '../../consts.js';
import {OfferEntity} from '../offer/offer.entity.js';
import {UserEntity} from '../user/user.entity.js';

const {prop, modelOptions, index} = typegoose;


@modelOptions({
  schemaOptions: {
    collection: 'comments',
  }
})
@index({author: 1, offer: 1}, {unique: true})
class CommentEntity extends defaultClasses.TimeStamps {
  constructor() {
    super();
  }

  @prop({
    trim: true,
    required: true,
    minlength: Comment.MinLength,
    maxlength: Comment.MaxLength,
    default: '',
  })
  public comment!: string;

  @prop({
    required: true,
    min: CommentRating.Min,
    max: CommentRating.Max,
    default: 0,
  })
  public rating!: number;

  @prop({
    required: true,
    ref: () => OfferEntity
  })
  public offer!: Ref<OfferEntity>;

  @prop({
    required: true,
    ref: () => UserEntity,
  })
  public author!: Ref<UserEntity>;

  public get date() {
    return this.createdAt;
  }
}


const CommentModel = getModelForClass(CommentEntity);


export {CommentEntity, CommentModel};
