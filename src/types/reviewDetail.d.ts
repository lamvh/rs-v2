export type reviewDetail = {
  _id: string;
  listing_id: number;
  reviewer_id: number;
  alt_reviewer_id?: number;
  alt_listing_id?: number;
  date: number;
  reviewer_name: string;
  comments: string;
  stemArray?: string[];
  sentiment?: number;
  id: string;
};
