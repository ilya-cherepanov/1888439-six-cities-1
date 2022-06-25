import { CITIES, UserType } from '../const';
import { Offer } from '../types/offer';
import { User } from '../types/user';
import { Review } from '../types/review';
import { ApiUser } from '../types/api-user';
import { ApiReview } from '../types/api-review';
import { ApiOffer } from '../types/api-offer';
import { NewUser } from '../types/new-user';
import { NewReview } from '../types/new-review';
import { NewApiReview } from '../types/new-api-review';
import { NewApiUser } from '../types/new-api-user';
import { NewOffer } from '../types/new-offer';
import { EditApiOffer } from '../types/edit-api-offer';

const transformApiUserToUser = (apiUser: ApiUser): User => {
  const transformedUser: User = {
    name: apiUser.name,
    email: apiUser.email,
    isPro: apiUser.userType === UserType.Pro,
    avatarUrl: apiUser.avatar,
  };

  return transformedUser;
};

const transformNewUserToApiNewUser = (newUser: NewUser): NewApiUser => {
  const transformedNewUser: NewApiUser = {
    email: newUser.email,
    name: newUser.name,
    password: newUser.password,
    userType: newUser.isPro ? UserType.Pro : UserType.Regular,
  };

  return transformedNewUser;
};

const transformApiReviewToReview = (apiReview: ApiReview): Review => {
  const transformedReview: Review = {
    id: apiReview.id,
    comment: apiReview.comment,
    date: apiReview.date,
    rating: apiReview.rating,
    user: transformApiUserToUser(apiReview.author),
  };

  return transformedReview;
};

const transformNewReviewToApiNewReview = (newReview: NewReview): NewApiReview => {
  const apiNewReview: NewApiReview = {
    comment: newReview.comment,
    rating: newReview.rating,
  };

  return apiNewReview;
};

const transformApiOfferToOffer = (apiOffer: ApiOffer): Offer => {
  const cityInfo = CITIES.find((city) => city.name === apiOffer.city);

  if (cityInfo === undefined) {
    throw new Error('City not found!');
  }

  const transformedOffer: Offer = {
    id: apiOffer.id,
    title: apiOffer.title,
    description: apiOffer.description,
    city: cityInfo,
    previewImage: apiOffer.previewImage,
    images: [...apiOffer.images],
    isPremium: apiOffer.isPremium,
    isFavorite: apiOffer.isFavorite,
    rating: apiOffer.rating,
    type: apiOffer.type,
    bedrooms: apiOffer.bedrooms,
    maxAdults: apiOffer.maxGuests,
    price: apiOffer.price,
    goods: [...apiOffer.goods],
    host: transformApiUserToUser(apiOffer.author),
    location: {...apiOffer.location},
  };

  return transformedOffer;
};

const transformNewOfferToEditApiOffer = (newOffer: NewOffer): EditApiOffer => {
  const newApiOffer: EditApiOffer = {
    title: newOffer.title,
    description: newOffer.description,
    city: newOffer.city.name,
    previewImage: newOffer.previewImage,
    images: [
      'https://9.react.pages.academy/static/hotel/1.jpg',
      'https://9.react.pages.academy/static/hotel/2.jpg',
      'https://9.react.pages.academy/static/hotel/3.jpg',
      'https://9.react.pages.academy/static/hotel/4.jpg',
      'https://9.react.pages.academy/static/hotel/5.jpg',
      'https://9.react.pages.academy/static/hotel/6.jpg',
    ],
    isPremium: newOffer.isPremium,
    type: newOffer.type,
    bedrooms: newOffer.bedrooms,
    maxGuests: newOffer.maxAdults,
    price: newOffer.price,
    goods: [...newOffer.goods],
    location: {...newOffer.location},
  };

  return newApiOffer;
};

const transformOfferToEditApiOffer = (offer: Offer): EditApiOffer => {
  const newApiOffer: EditApiOffer = {
    title: offer.title,
    description: offer.description,
    city: offer.city.name,
    previewImage: offer.previewImage,
    images: [
      'https://9.react.pages.academy/static/hotel/1.jpg',
      'https://9.react.pages.academy/static/hotel/2.jpg',
      'https://9.react.pages.academy/static/hotel/3.jpg',
      'https://9.react.pages.academy/static/hotel/4.jpg',
      'https://9.react.pages.academy/static/hotel/5.jpg',
      'https://9.react.pages.academy/static/hotel/6.jpg',
    ],
    isPremium: offer.isPremium,
    type: offer.type,
    bedrooms: offer.bedrooms,
    maxGuests: offer.maxAdults,
    price: offer.price,
    goods: [...offer.goods],
    location: {...offer.location},
  };

  return newApiOffer;
};

export {
  transformApiUserToUser,
  transformNewUserToApiNewUser,
  transformApiOfferToOffer,
  transformNewOfferToEditApiOffer,
  transformOfferToEditApiOffer,
  transformApiReviewToReview,
  transformNewReviewToApiNewReview,
};
