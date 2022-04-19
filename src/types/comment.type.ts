import {User} from './user.type';


export type Comment = {
  comment: string,
  date: string,
  rating: number,
  author: User
}
