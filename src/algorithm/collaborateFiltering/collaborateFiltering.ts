//
// this CF algorithm use this library: https://github.com/TSonono/collaborative-filtering
//

import {
  getReviewWithFakedData,
  getReviewerIdsFromReviewDetails,
} from "../../data/review/review";
import Bluebird from "bluebird";
import { getListings } from "../../data/listing/listing";
import { find } from "lodash";
// tslint:disable-next-line: no-var-requires
const recommend = require("collaborative-filter");

const CF_LISTINGS = process.env.CF_LISTINGS;

const log = console.log;

export const tranferDataToMatrix = async () => {
  log("--- Creating matrix from review data");

  if (!CF_LISTINGS) {
    console.log("!!! No LIMIT_LISTING configured");
    throw new Error("!!! No LIMIT_LISTING configured");
  }

  const reviews = await getReviewWithFakedData();
  if (reviews.length === 0) {
    console.log("!!! Reviews is empty");
  }

  const listings = await getListings(+CF_LISTINGS);
  const reviewerIds = await getReviewerIdsFromReviewDetails(reviews);

  console.log(
    "- listing",
    listings.forEach((listing) => console.log(listing.id))
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
      console.log("- user", reviewerId, userRate);
      return userRate;
    }
  );

  return rating;
};

export const trainDataWithCollaborativeFilter = async (matrix: number[][]) => {
  const coMatrix = recommend.coMatrix(matrix, 5, 5);
  console.log(recommend.getRecommendations(matrix, coMatrix, 2));
  console.log(recommend.getRecommendations(matrix, coMatrix, 0));
  console.log(recommend.getRecommendations(matrix, coMatrix, 4));
};

export const trainData = async () => {
  const dataExample: number[][] = [
    [1, 1, 1, 0, 0],
    [1, 0, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 0, 1, 1],
  ];

  const reviewData = await tranferDataToMatrix();
  trainDataWithCollaborativeFilter(reviewData);
};
