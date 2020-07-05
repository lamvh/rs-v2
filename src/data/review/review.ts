import { reviewDetail } from "../../types/reviewDetail";
import Bluebird from "bluebird";
import { includes } from "lodash";
import { collectionsEnum } from "../../types/enum";
import { getDataByCollection, collection } from "../../utils/mongo";
import { listingDetail } from "../../types/listingDetail";

export const getReviewerIdsFromReviewDetails = async (
  reviewDetails: reviewDetail[]
): Promise<string[]> => {
  return reviewDetails.map((review) => review.alt_reviewer_id!.toString());
};

export const getReviewsByReviewerId = async ({
  reviewDetails,
  reviewerId,
}: {
  reviewDetails: reviewDetail[];
  reviewerId: string;
}) => {
  return reviewDetails.filter(
    (review) => review.alt_reviewer_id === +reviewerId
  );
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

export const getReviewWithFakedData = async (): Promise<reviewDetail[]> => {
  const col = await collection(collectionsEnum.reviewDetails);
  const data = await col
    .find({ alt_reviewer_id: { $ne: null }, alt_listing_id: { $ne: null } })
    .limit(10000)
    .toArray();

  if (!data || data.length === 0) {
    throw new Error("Data is empty");
  }

  console.log(`- Found ${data.length} reviews`);

  return data;
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
    if (includes(listingIds, review.alt_listing_id)) {
      // filteredReviews.push(review);
      return review;
    }
  });

  // return filteredReviews;
};
