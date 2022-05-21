import {City} from './types/city.enum.js';


const CityLocations = {
  [City.Amsterdam]: {
    latitude: 52.370216,
    longitude: 4.895168,
  },
  [City.Brussels]: {
    latitude: 50.846557,
    longitude: 4.351697,
  },
  [City.Cologne]: {
    latitude: 50.938361,
    longitude: 6.959974,
  },
  [City.Dusseldorf]: {
    latitude: 51.225402,
    longitude: 6.776314,
  },
  [City.Hamburg]: {
    latitude: 53.550341,
    longitude: 10.000654,
  },
  [City.Paris]: {
    latitude: 48.85661,
    longitude: 2.351499,
  },
} as const;


enum Rating {
  Min = 1,
  Max = 5,
  Precision = 1
}


enum Price {
  Min = 100,
  Max = 100_000
}


enum Bedrooms {
  Min = 1,
  Max = 8,
}


enum Guests {
  Min = 1,
  Max = 10,
}

enum Location {
  Deviation = 0.1,
  Precision = 6
}

enum OfferTitle {
  Min = 10,
  Max = 120,
}

enum OfferDescription {
  Min = 20,
  Max = 1024,
}

enum UserName {
  MinLength = 1,
  MaxLength = 15,
}


const IMAGES_COUNT = 6;

const MIN_GOODS = 1;

const TSV_ARRAY_DELIMITER = ',';

const DEFAULT_OFFERS_COUNT = 60;

const MAX_PREMIUM_COUNT = 3;


export {
  CityLocations,
  Rating,
  Price,
  Bedrooms,
  Guests,
  Location,
  OfferTitle,
  OfferDescription,
  UserName,
  TSV_ARRAY_DELIMITER,
  IMAGES_COUNT,
  MIN_GOODS,
  DEFAULT_OFFERS_COUNT,
  MAX_PREMIUM_COUNT,
};
