import {TSV_ARRAY_DELIMITER} from '../consts.js';
import {City} from '../types/city.enum.js';
import {Good} from '../types/good.enum.js';
import {HousingType} from '../types/housing-type.enum.js';
import {Offer} from '../types/offer.type.js';
import {UserType} from '../types/user-type.enum.js';
import {User} from '../types/user.type.js';


const createOffer = (row: string): Offer => {
  const fields = row.split('\t');
  const [
    title,
    description,
    date,
    city,
    previewImage,
    images,
    isPremium,
    rating,
    type,
    bedrooms,
    maxGuests,
    price,
    goods,
    userEmail,
    userPassword,
    userName,
    userType,
    userAvatar,
    comments,
    location
  ] = fields;

  const user: User = {
    email: userEmail,
    password: userPassword,
    name: userName,
    userType: userType as UserType
  };

  if (userAvatar) {
    user.avatar = userAvatar;
  }

  return {
    title,
    description,
    date,
    city: city as City,
    previewImage,
    images: images.split(TSV_ARRAY_DELIMITER),
    isPremium: Boolean(Number(isPremium)),
    rating: Number(rating),
    type: type as HousingType,
    bedrooms: Number(bedrooms),
    maxGuests: Number(maxGuests),
    price: Number(price),
    goods: goods.split(TSV_ARRAY_DELIMITER) as Good[],
    author: user,
    comments: Number(comments),
    location: {
      latitude: Number(location.split(TSV_ARRAY_DELIMITER)[0]),
      longitude: Number(location.split(TSV_ARRAY_DELIMITER)[1]),
    },
  };
};


export {createOffer};
