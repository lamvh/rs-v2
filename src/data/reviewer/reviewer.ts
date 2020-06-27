import { getReviewDetailData } from "../review/review";
import { uniqBy, difference, sortBy, reverse } from "lodash";
import { reviewer } from "../../types/reviewer";
import { reviewDetail } from "../../types/reviewDetail";
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

export const getNumberOfReviewByUsers = async (opt: {
  users: reviewer[];
  reviews: reviewDetail[];
}): Promise<reviewer[]> => {
  const reviewers = await Promise.all(
    opt.users.map(async (user) => {
      let count = 0;
      opt.reviews.forEach((review) => {
        if (review.reviewer_id === user.id) {
          ++count;
        }
      });

      return { ...user, numberOfReview: count };
    })
  );

  const sortedReviewers = reverse(sortBy(reviewers, ["numberOfReview"]));

  return sortedReviewers;
};

export const fakeData = async () => {};
