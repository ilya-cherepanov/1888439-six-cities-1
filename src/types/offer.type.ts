import {City} from './city.enum';
import {Good} from './good.enum';
import {HousingType} from './housing-type.enum';


export type Offer = {
  title: string;
  description: string;
  date: string;
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
  authorId: number;
  comments: number;
  location: {
    latitude: number;
    longitude: number;
  };
}
