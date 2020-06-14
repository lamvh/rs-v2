import Raccoon from "@maruware/raccoon";
import { getDataByCollection, getReviewDetailData } from "../utils/mongo";
import { collectionsEnum } from "../types/enum";
import Bluebird from "bluebird";
import { reviewDetail } from "../types/reviewDetail";
import { listingDetail } from "../types/listingDetail";

const REDIS_URL = process.env.REDIS_URL;
const CLASS_NAME = "airbnb";

const REVIEW_LIMIT = 10000;

const initRedis = async (): Promise<Raccoon> => {
  if (!REDIS_URL) {
    throw new Error("!!! REDIS URL not found");
  }
  const raccoon = new Raccoon({
    className: CLASS_NAME,
    redisUrl: REDIS_URL,
  });

  if (!raccoon) {
    throw new Error(
      `Can not create Raccoon, className: ${CLASS_NAME} redisUrl: ${REDIS_URL}`
    );
  }

  console.log("--- RACCOON class name:", CLASS_NAME);
  console.log("--- RACCOON redis:", REDIS_URL);

  return raccoon;
};

const likeOrDislike = async (raccoon: Raccoon) => {
  const reviewDetails: reviewDetail[] = await getDataByCollection({
    collection: collectionsEnum.reviewDetails,
    limit: REVIEW_LIMIT,
  });

  const listingDetails: listingDetail[] = await getDataByCollection({
    collection: collectionsEnum.listingDetails,
  });

  let like = 0;
  let dislike = 0;

  await Promise.all(
    reviewDetails.map((review) => {
      if (review.sentiment) {
        if (review.sentiment >= 0) {
          console.log(
            "like - - -",
            review.reviewer_id,
            "liked",
            review.listing_id,
            "- - - ",
            review.sentiment,
            review.reviewer_name
          );
          raccoon.liked(
            review.reviewer_id.toString(),
            review.listing_id.toString()
          );
          like += 1;
        } else {
          console.log(
            "dislike - - -",
            review.reviewer_id,
            "disliked",
            review.listing_id,
            "- - - ",
            review.sentiment,
            review.reviewer_name
          );
          raccoon.disliked(
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

export const runRaccoon = async () => {
  const raccoon = await initRedis();

  await likeOrDislike(raccoon);

  const reviews = await getReviewDetailData(REVIEW_LIMIT);

  const recs = await raccoon.recommendFor(
    reviews[10].reviewer_id.toString(),
    10
  );

  console.log("=== Recommend for", reviews[10].reviewer_id.toString(), recs);
};

export default runRaccoon;
