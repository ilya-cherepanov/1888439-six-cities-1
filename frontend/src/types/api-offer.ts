import { ApiUser } from './api-user';

export type ApiOffer = {
  id: string;
  title: string;
  description: string;
  date: string;
  city: string;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: string;
  bedrooms: number;
  maxGuests: number;
  price: number;
  goods: string[];
  author: ApiUser;
  comments: number;
  location: {
    latitude: number;
    longitude: number;
  };
}
