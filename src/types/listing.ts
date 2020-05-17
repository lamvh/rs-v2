export type listing = {
  _id: string;
  id: number;
  name: string;
  host_id: number;
  host_name: string;
  neighbourhood: string;
  latitude: number;
  longitude: number;
  room_type: string;
  price: number;
  minimum_nights: number;
  number_of_reviews: number;
  last_review: number;
  reviews_per_month: number;
  calculated_host_listings_count: number;
  availability_365: number;
};
