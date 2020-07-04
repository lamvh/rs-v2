import Raccoon from "@maruware/raccoon";
import { reviewDetail } from "../../types/reviewDetail";
import { getDataByCollection } from "../../utils/mongo";
import { listingDetail } from "../../types/listingDetail";
import { collectionsEnum } from "../../types/enum";
import Bluebird from "bluebird";
import { includes } from "lodash";
import {
  getReviewerIdsFromReviewDetails,
  getReviews,
  getReviewsByReviewerId,
} from "../../data/review/review";
import { getListings } from "../../data/listing/listing";

const log = console.log;

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

  await Bluebird.each(reviewDetails, async (review, index) => {
    const reviewerId = review.alt_reviewer_id ?? review.reviewer_id;
    if (review.sentiment && review.alt_listing_id) {
      if (review.sentiment >= 0) {
        await raccoon.liked(
          reviewerId.toString(),
          review.alt_listing_id.toString()
        );

        log(
          "- Like",
          index,
          "/",
          reviewDetails.length,
          "reviewer",
          review.alt_reviewer_id,
          "listingId",
          review.alt_listing_id
        );

        ++like;
      } else {
        await raccoon.disliked(
          reviewerId.toString(),
          review.alt_listing_id.toString()
        );
        log(
          "- Dislike",
          index,
          "/",
          reviewDetails.length,
          "reviewer",
          review.alt_reviewer_id,
          "listingId",
          review.alt_listing_id
        );

        ++dislike;
      }
    }
  });

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
  const listings = await getListings(opt.listingLimit);

  const reviews = await getReviews(opt.reviewLimit);

  if (!listings) {
    throw new Error("!!! No listings found");
  }

  if (!reviews) {
    throw new Error("!!! No reviews found");
  }

  const listingIds = listings.map((listing: any) => listing.id.toString());

  const filteredReviews: reviewDetail[] = [];

  reviews.map(async (review) => {
    if (
      review.alt_listing_id &&
      includes(listingIds, review.alt_listing_id.toString())
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
    const result = await raccoon.recommendFor(reviewerId, 25);
    console.log(reviewerId, result);
    if (result && result.length !== 0) {
      recommendResult.push(result);

      log(
        "--------------------------------------------------------------------------------"
      );

      log(
        "=== Recommend",
        result.length,
        "for reviewerId",
        reviewerId,
        ":",
        result
      );

      log(
        "Reviewer",
        reviewerId,
        "reviewed hotel",
        (await getReviewsByReviewerId({ reviewDetails, reviewerId })).map(
          (review) => ({
            listing: review.alt_listing_id,
            sentiment: review.sentiment,
          })
        )
      );
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