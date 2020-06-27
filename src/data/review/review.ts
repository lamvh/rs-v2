import { reviewDetail } from "../../types/reviewDetail";
import Bluebird from "bluebird";
import { includes } from "lodash";
import { collectionsEnum } from "../../types/enum";
import { getDataByCollection } from "../../utils/mongo";
import { listingDetail } from "../../types/listingDetail";

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

export const getReviews = async (
  limit: number = 1000000
): Promise<reviewDetail[]> => {
  return getDataByCollection({
    collection: collectionsEnum.reviewDetails,
    limit,
  });
};

export const getReviewsFromListings = async ({
  reviews,
  listings,
}: {
  reviews: reviewDetail[];
  listings: listingDetail[];
}): Promise<reviewDetail[]> => {
  if (reviews?.length === 0) {
    throw new Error("Review is empty");
  }

  if (listings?.length === 0) {
    throw new Error("Listing is empty");
  }

  // const filteredReviews: reviewDetail[] = [];
  const listingIds = listings.map((listing) => listing.id);

  return await Bluebird.each(reviews, async (review) => {
    if (includes(listingIds, review.listing_id.toString())) {
      // filteredReviews.push(review);
      return review;
    }
  });

  // return filteredReviews;
};
