import { getReviewDetailData } from "../review/review";
import { uniqBy, difference, sortBy, reverse } from "lodash";
import { reviewer } from "../../types/reviewer";
import { reviewDetail } from "../../types/reviewDetail";
import { collection } from "../../utils/mongo";
import { collectionsEnum } from "../../types/enum";
const log = console.log;

export const getReviewersFromReviewDetails = async (): Promise<{
  uniq: reviewer[];
  regular: reviewer[];
  reviewers: reviewer[];
}> => {
  const reviewers = (await getReviewDetailData()).map((review) => ({
    id: review.reviewer_id,
    name: review.reviewer_name,
  }));
  log("Found", reviewers.length, "raw");

  const uniqReviewers = uniqBy(reviewers, "id");
  log("Found", uniqReviewers.length, "uniq");

  const regularlyReviewer = uniqBy(difference(reviewers, uniqReviewers), "id");
  log("Found", regularlyReviewer.length, "regular");

  return {
    reviewers,
    uniq: uniqReviewers,
    regular: regularlyReviewer,
  };
};

export const getUsersWithNumberOfReview = async (opt: {
  reviewers: reviewer[];
  reviews: reviewDetail[];
}): Promise<reviewer[]> => {
  const reviewers = await Promise.all(
    opt.reviewers.map(async (user, index) => {
      let numberOfReview = 0;
      opt.reviews.forEach((review) => {
        if (review.reviewer_id === user.id) {
          ++numberOfReview;
          log(index, user);
        }
      });
      return { ...user, numberOfReview };
    })
  );

  const sortedData = reverse(sortBy(reviewers, ["numberOfReview"]));

  return sortedData;
};

export const getReviewers = async (
  limit: number = 500
): Promise<reviewer[]> => {
  return (await collection(collectionsEnum.reviewers))
    .find()
    .limit(limit)
    .toArray();
};
