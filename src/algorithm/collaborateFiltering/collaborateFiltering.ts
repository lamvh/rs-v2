import recommendation from "./lib/algorithm";
import {
  transferDataToMatrix,
  getRecommendAndMapToListingIdByUserIdx,
} from "./utils";
import { checkRatingValues } from "./lib/utils";

const log = console.log;

export const trainData = async () => {
  const ratings = await transferDataToMatrix();

  log("ratings", ratings.length);

  const coMatrix = recommendation.coMatrix(ratings);

  const rec1 = await getRecommendAndMapToListingIdByUserIdx(
    ratings,
    coMatrix,
    1
  );

  // log(rec1);
};
