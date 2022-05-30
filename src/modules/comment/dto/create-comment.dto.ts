import {IsMongoId, IsNumber, Max, MaxLength, Min, MinLength} from 'class-validator';
import {Comment, CommentRating} from '../../../consts.js';


export default class CreateCommentDTO {
  @MinLength(Comment.MinLength, {message: `Minimum comment length must be greater than ${Comment.MinLength}`})
  @MaxLength(Comment.MinLength, {message: `Maximum comment length must be less than ${Comment.MaxLength}`})
  public comment!: string;

  @IsNumber({}, {message: 'rating must be number'})
  @Min(CommentRating.Min, {message: `Minimum rating must be greater than ${CommentRating.Min}`})
  @Max(CommentRating.Max, {message: `Maximum rating must be less than ${CommentRating.Max}`})
  public rating!: string;

  @IsMongoId({message: 'offer must be of MongoId type'})
  public offer!: string;

  @IsMongoId({message: 'author must be of MongoId type'})
  public author!: string;
}
