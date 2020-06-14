export type reviewDetail = {
  _id: string;
  listing_id: number;
  date: number;
  reviewer_id: number;
  reviewer_name: string;
  comments: string;
  stemArray?: string[];
  sentiment?: number;
};
