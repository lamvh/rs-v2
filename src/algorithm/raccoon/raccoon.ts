import {
  likeOrDislike,
  getReviewFromListing,
  getRecommendForAllUser,
} from "./utils";
import { initRedis } from "../../utils/redis";

const REVIEW_LIMIT = 300000;
const LISTING_LIMIT = 20000;

const RUN_LIKE_OR_DISLIKE = true;
const GET_RECOMMEND_USER = true;
const GET_MOST_SIMILAR_USER = true;

export const raccoon = async () => {
  const rac = await initRedis();
  const reviews = await getReviewFromListing({
    reviewLimit: REVIEW_LIMIT,
    listingLimit: LISTING_LIMIT,
  });

  // console.log(reviews.slice(10));
  // const userIds = await getUserIdsFromReviewDetails(reviews.slice(10));

  if (RUN_LIKE_OR_DISLIKE) {
    await likeOrDislike(rac, reviews);
  }

  if (GET_RECOMMEND_USER) {
    await getRecommendForAllUser(rac, reviews);
  }

  if (GET_MOST_SIMILAR_USER) {
    // await getMostSimilarUsers(userIds, rac);
    console.log(await rac.mostSimilarUsers("1377846"));
  }
};

export default raccoon;
