import { ApiUser } from './api-user';

export type ApiReview = {
  id: string;
  comment: string;
  rating: number;
  date: string;
  author: ApiUser;
}
