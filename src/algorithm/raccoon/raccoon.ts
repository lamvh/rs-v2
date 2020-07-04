import { likeOrDislike, getRecommendForAllUser } from "./utils";
import { initRedis } from "../../utils/redis";
import { getReviewWithAltReviewerId } from "../../data/review/review";

const RUN_LIKE_OR_DISLIKE = true;
const GET_RECOMMEND_USER = true;
const GET_MOST_SIMILAR_USER = false;

// Get reviews
// Run like or dislike
// Get all recommend

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

  console.log("Most like", await rac.mostLiked());
  console.log("Most dislike", await rac.mostDisliked());
  console.log("Count like 2818", await rac.likedCount("2818"));
  console.log("Most similar 9181635", await rac.mostSimilarUsers("9181635"));
};

export default raccoon;
