import {City} from './city.enum';
import {Good} from './good.enum';
import {HousingType} from './housing-type.enum';
import {User} from './user.type';


export type Offer = {
  title: string;
  description: string;
  date: Date;
  city: City;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  rating: number;
  type: HousingType;
  bedrooms: number;
  maxGuests: number;
  price: number;
  goods: Good[];
  author: User;
  comments: number;
  location: {
    latitude: number;
    longitude: number;
  };
}
