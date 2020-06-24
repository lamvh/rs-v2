import Raccoon from "@maruware/raccoon";
import { reviewDetail } from "../../types/reviewDetail";
import {
  getDataByCollection,
  getListingDetailData,
  getReviewDetailData,
} from "../../utils/mongo";
import { listingDetail } from "../../types/listingDetail";
import { collectionsEnum } from "../../types/enum";
import Bluebird from "bluebird";
import { includes } from "lodash";
import { getReviewerIdsFromReviewDetails } from "../../data/reviewDetail/reviewDetail";

export const example = async (raccoon: Raccoon) => {
  await raccoon.liked("garyId", "movie2Id");
  await raccoon.liked("chrisId", "movieId");
  const recs = await raccoon.recommendFor("chrisId", 10);
  console.log(recs);
};

export const likeOrDislike = async (
  raccoon: Raccoon,
  reviewDetails: reviewDetail[]
) => {
  const listingDetails: listingDetail[] = await getDataByCollection({
    collection: collectionsEnum.listingDetails,
  });

  let like = 0;
  let dislike = 0;

  await Promise.all(
    reviewDetails.map(async (review) => {
      if (review.sentiment) {
        if (review.sentiment >= 0) {
          // console.log(
          //   "like - - -",
          //   review.reviewer_id,
          //   "liked",
          //   review.listing_id,
          //   "- - - ",
          //   review.sentiment,
          //   review.reviewer_name
          // );
          await raccoon.liked(
            review.reviewer_id.toString(),
            review.listing_id.toString()
          );
          like += 1;
        } else {
          // console.log(
          //   "dislike - - -",
          //   review.reviewer_id,
          //   "disliked",
          //   review.listing_id,
          //   "- - - ",
          //   review.sentiment,
          //   review.reviewer_name
          // );
          await raccoon.disliked(
            review.reviewer_id.toString(),
            review.listing_id.toString()
          );
          dislike += 1;
        }
      }
      return Bluebird.delay(300);
    })
  );

  console.log("=== Total review: ", reviewDetails.length);
  console.log("=== Total like: ", like);
  console.log("=== Total dislike: ", dislike);

  return { review: reviewDetails, listing: listingDetails };
};

export const getReviewFromListing = async (
  opt: {
    reviewLimit: number;
    listingLimit: number;
  } = { reviewLimit: 300000, listingLimit: 20000 }
) => {
  const listings = await getListingDetailData(opt.listingLimit);
  const reviews = await getReviewDetailData(opt.reviewLimit);

  if (!listings) {
    throw new Error("!!! No listings found");
  }

  if (!reviews) {
    throw new Error("!!! No reviews found");
  }

  const listingIds = listings.map((listing) => listing.id.toString());

  const filteredReviews: reviewDetail[] = [];

  reviews.map(async (review) => {
    if (
      review.listing_id &&
      includes(listingIds, review.listing_id.toString())
    ) {
      filteredReviews.push(review);
    }
  });

  console.log(
    "--- Filtered Review: ",
    filteredReviews.length,
    " reviews on ",
    listingIds.length,
    " listings"
  );

  return filteredReviews;
};

export const getRecommendForAllUser = async (
  raccoon: Raccoon,
  reviewDetails: reviewDetail[]
) => {
  const reviewIds = await getReviewerIdsFromReviewDetails(reviewDetails);

  const recommendResult: any[] = [];

  await Bluebird.each(reviewIds, async (reviewerId, index) => {
    const result = await raccoon.recommendFor(reviewerId, 10);
    if (result && result.length !== 0) {
      recommendResult.push(result);
      console.log(
        "=== Recommend for",
        result.length,
        "reviewerId",
        reviewerId,
        ":",
        result
      );
    } else {
      // console.log( '---  Recommend: 'index, reviewerId);
    }
    return Bluebird.delay(0);
  });

  console.log("=======================");
  console.log("Found", recommendResult.length, "recommend");
  return recommendResult;
};

export const getMostSimilarUser = async (
  userId: string,
  raccoon: Raccoon
): Promise<string[]> => {
  return await raccoon.mostSimilarUsers(userId);
};

export const getMostSimilarUsers = async (
  userIds: string[],
  raccoon: Raccoon
): Promise<any[][]> => {
  console.log("--- Get most similar user", userIds.length, "users");

  const result: any[] = [];

  await Bluebird.each(userIds, async (userId, index) => {
    const mostSimilarUser = await getMostSimilarUser(userId, raccoon);

    if (mostSimilarUser && mostSimilarUser.length !== 0) {
      result.push(mostSimilarUser);
      console.log("=== Most similar user", userId, ":", mostSimilarUser);
    } else {
      console.log(index, userId);
    }
  });

  console.log("==============");
  console.log("Found", result.length, "similar user");

  return result;
};
