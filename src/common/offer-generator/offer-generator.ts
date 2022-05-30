import dayjs from 'dayjs';
import {Bedrooms, CityLocations, Guests, IMAGES_COUNT, Location, MIN_GOODS, Price, OfferRating, TSV_ARRAY_DELIMITER} from '../../consts.js';
import {City} from '../../types/city.enum.js';
import {MockData} from '../../types/mock-data.type.js';
import {getOneRandomArrayElement, getRandomArrayElements, getRandomBool, getRandomFixedPoint, getRandomInt} from '../../utils/random.js';
import {OfferGeneratorInterface} from './offer-generator.interface.js';


export class OfferGenerator implements OfferGeneratorInterface {
  constructor(private readonly mockData: MockData) {}

  generate(): string {
    const title = getOneRandomArrayElement(this.mockData.titles);
    const description = getOneRandomArrayElement(this.mockData.descriptions);
    const date = dayjs().subtract(getRandomInt(1, 365), 'day').toISOString();
    const city = getOneRandomArrayElement(this.mockData.cities);
    const previewImage = getOneRandomArrayElement(this.mockData.images);
    const images = getRandomArrayElements(this.mockData.images, IMAGES_COUNT).join(TSV_ARRAY_DELIMITER);
    const isPremium = Number(getRandomBool());
    const rating = getRandomFixedPoint(OfferRating.Min, OfferRating.Max, OfferRating.Precision);
    const type = getOneRandomArrayElement(this.mockData.housingTypes);
    const bedrooms = getRandomInt(Bedrooms.Min, Bedrooms.Max);
    const maxGuests = getRandomInt(Guests.Min, Guests.Max);
    const price = getRandomInt(Price.Min, Price.Max);
    const goods = getRandomArrayElements(this.mockData.goods, getRandomInt(MIN_GOODS, this.mockData.goods.length)).join(TSV_ARRAY_DELIMITER);
    const userName = getOneRandomArrayElement(this.mockData.userNames);
    const userEmail = `${userName}@mail.com`;
    const userAvatar = getRandomBool() ? getOneRandomArrayElement(this.mockData.avatars) : '';
    const userPassword = 'pass1234';
    const userType = getOneRandomArrayElement(this.mockData.userTypes);
    const comments = getRandomInt(0, 10);
    const latitude = getRandomFixedPoint(
      CityLocations[city as City].latitude - Location.Deviation,
      CityLocations[city as City].latitude + Location.Deviation,
      Location.Precision
    );
    const longitude = getRandomFixedPoint(
      CityLocations[city as City].longitude - Location.Deviation,
      CityLocations[city as City].longitude + Location.Deviation,
      Location.Precision
    );
    const location: string = latitude + TSV_ARRAY_DELIMITER + longitude;

    return [
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
    ].join('\t');
  }
}
