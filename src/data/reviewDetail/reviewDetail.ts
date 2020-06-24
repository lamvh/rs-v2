import { reviewDetail } from "../../types/reviewDetail";
import Bluebird from "bluebird";
import { includes } from "lodash";

export const getReviewerIdsFromReviewDetails = async (
  reviewDetails: reviewDetail[]
): Promise<string[]> => {
  return reviewDetails.map((review) => review.reviewer_id.toString());
};

export const getUserIdsFromReviewDetails = async (
  reviewDetails: reviewDetail[]
): Promise<string[]> => {
  const users: string[] = [];

  await Bluebird.each(reviewDetails, async (review, index) => {
    if (review.reviewer_id && !includes(users, review.reviewer_id.toString())) {
      users.push(review.reviewer_id.toString());
      console.log(index, review.reviewer_id);
    }
    // return Bluebird.delay(10);
  });

  return users;
};
