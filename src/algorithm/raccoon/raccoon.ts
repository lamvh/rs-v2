import {
  likeOrDislike,
  getReviewFromListing,
  getRecommendForAllUser,
} from "./utils";
import { initRedis } from "../../utils/redis";
import { getReviewWithAltReviewerId } from "../../data/review/review";

const RUN_LIKE_OR_DISLIKE = true;
const GET_RECOMMEND_USER = true;
const GET_MOST_SIMILAR_USER = true;

export const raccoon = async () => {
  const rac = await initRedis();

  const reviews = await getReviewWithAltReviewerId();

  if (RUN_LIKE_OR_DISLIKE) {
    await likeOrDislike(rac, reviews);
  }

  if (GET_RECOMMEND_USER) {
    await getRecommendForAllUser(rac, reviews);
  }

  if (GET_MOST_SIMILAR_USER) {
    // await getMostSimilarUsers(userIds, rac);
  }
};

export default raccoon;
