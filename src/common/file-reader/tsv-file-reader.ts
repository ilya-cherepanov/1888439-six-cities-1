import {readFileSync} from 'fs';
import {City} from '../../types/city.enum.js';
import {Good} from '../../types/good.enum.js';
import {HousingType} from '../../types/housing-type.enum.js';
import {Offer} from '../../types/offer.type.js';
import {FileReaderInterface} from './file-reader.interface.js';


export default class TSVFileReader implements FileReaderInterface {
  private rawData = '';

  constructor(public fileName: string) {}

  public read = (): void => {
    this.rawData = readFileSync(this.fileName, 'utf-8');
  };

  public toArray = (): Offer[] => {
    if (!this.rawData) {
      return [];
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(([
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
        authorId,
        comments,
        location,
      ]) => {
        const newOffer: Offer = {
          title,
          description,
          date,
          city: city as City,
          previewImage,
          images: images.split(','),
          isPremium: Boolean(Number(isPremium)),
          rating: Number(rating),
          type: type as HousingType,
          bedrooms: Number(bedrooms),
          maxGuests: Number(maxGuests),
          price: Number(price),
          goods: goods.split(',') as Good[],
          authorId: Number(authorId),
          comments: Number(comments),
          location: {
            latitude: Number(location.split(',')[0]),
            longitude: Number(location.split(',')[1]),
          },
        };

        return newOffer;
      });
  };
}
