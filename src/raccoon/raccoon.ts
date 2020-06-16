import {
  likeOrDislike,
  getReviewFromListing,
  getRecommendForAllUser,
} from "./utils";
import { initRedis } from "../utils/redis";

const RUN_LIKE_OR_DISLIKE = false;
const GET_RECOMMEND_USER = true;

const REVIEW_LIMIT = 10000;

export const raccoon = async () => {
  const rac = await initRedis();
  const reviews = await getReviewFromListing(REVIEW_LIMIT);

  if (RUN_LIKE_OR_DISLIKE) {
    await likeOrDislike(rac, reviews);
  }

  if (GET_RECOMMEND_USER) {
    await getRecommendForAllUser(rac, reviews);
  }

  const mostSimillar = await rac.mostSimilarUsers("1377846");
};

export default raccoon;
