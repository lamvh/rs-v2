import { reviewDetail } from "../types/reviewDetail";

export const getReviewerIdsFromReviewDetails = async (
  reviewDetails: reviewDetail[]
): Promise<string[]> => {
  return reviewDetails.map((review) => review.reviewer_id.toString());
};
