import { getReviewWithFakedData } from "../../data/review/review";
import Bluebird from "bluebird";
import { getListings } from "../../data/listing/listing";
import { find } from "lodash";
import { recommendation } from "./lib";
import { getReviewersFromReviewDetails } from "../../data/reviewer/reviewer";

const log = console.log;
const CF_LISTINGS = process.env.CF_LISTINGS;

export const transferDataToMatrix = async () => {
  log("--- Creating matrix from review data / transferDataToMatrix");

  if (!CF_LISTINGS) {
    console.log("!!! No LIMIT_LISTING configured");
    throw new Error("!!! No LIMIT_LISTING configured");
  }

  const reviews = await getReviewWithFakedData();
  if (reviews.length === 0) {
    console.log("!!! Reviews is empty");
  }

  const listings = await getListings(+CF_LISTINGS);
  // const reviewerIds = await getReviewerIdsFromReviewDetails(reviews);
  const { uniq } = await getReviewersFromReviewDetails();
  const reviewerIds = uniq.map((reviewer) => reviewer.id);

  log("---", "Found", reviewerIds.length, "reviewer");
  log("--- ReviewerIds", reviewerIds);

  console.log(
    "-",
    listings.length,
    "listing in CO matrix",
    listings.map((listing) => listing.id)
  );

  const rating: number[][] = await Bluebird.map(
    reviewerIds,
    async (reviewerId) => {
      const userRate: number[] = await Bluebird.map(
        listings,
        async (listing) => {
          const review = find(
            reviews,
            (review) =>
              review.alt_reviewer_id === +reviewerId &&
              review.alt_listing_id === listing.id
          );

          if (!review?.sentiment || review.sentiment < 0) {
            return 0;
          }

          return 1;
        }
      );
      await Bluebird.delay(50);
      // console.log("- user", reviewerId, userRate);
      return userRate;
    }
  );

  return rating;
};

export const mapRecommendedItemToListingIds = async (recommendIds: any[]) => {
  if (!CF_LISTINGS) {
    throw new Error("!!! No LIMIT_LISTING configured");
  }
  const listings = await getListings(+CF_LISTINGS);

  return await Bluebird.map(recommendIds, (idx) => listings[idx].id);
};

export const getRecommendAndMapToListingIdByUserIdx = async (
  ratings: any[],
  coMatrix: math.Matrix,
  userIdx: number
) => {
  const recommend = recommendation.getRecommendations(
    ratings,
    coMatrix,
    userIdx
  );
  const mapped = await mapRecommendedItemToListingIds(recommend);

  // log("--- Recommend for userIdx", userIdx, ":", mapped);
  return mapped;
};
