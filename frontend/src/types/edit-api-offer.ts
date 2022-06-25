export type EditApiOffer = {
  title: string;
  description: string;
  city: string;
  previewImage: string;
  images: string[];
  type: string;
  isPremium: boolean;
  bedrooms: number;
  maxGuests: number;
  price: number;
  goods: string[];
  location: {
    latitude: number;
    longitude: number;
  };
}
