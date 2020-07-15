import { likeOrDislike, getRecommendForAllUser } from "./utils";
import { initRedis } from "../../utils/redis";
import { getReviewWithFakedData } from "../../data/review/review";

const log = console.log;

const RUN_LIKE_OR_DISLIKE = process.env.RUN_LIKE_OR_DISLIKE;
const GET_RECOMMEND_USER = process.env.GET_RECOMMEND_USER;
const GET_MOST_SIMILAR_USER = process.env.GET_MOST_SIMILAR_USER;

// Get reviews
// Run like or dislike
// Get all recommend

export const raccoon = async () => {
  log(
    "============================================================================",
    "================================== RACCOON =================================",
    "============================================================================"
  );

  const rac = await initRedis();
  const reviews = await getReviewWithFakedData();

  if (RUN_LIKE_OR_DISLIKE === "true") {
    await likeOrDislike(rac, reviews);
  }

  if (GET_RECOMMEND_USER === "true") {
    await getRecommendForAllUser(rac, reviews);
  }

  if (GET_MOST_SIMILAR_USER === "true") {
    // await getMostSimilarUsers(userIds, rac);
  }
  // console.log("=================", await rac.recommendFor("223397215", 10));
  // console.log("Most like", await rac.mostLiked());
  // console.log("Most dislike", await rac.mostDisliked());
};

export default raccoon;
