import recommendation from "./lib/algorithm";
import {
  transferDataToMatrix,
  getRecommendAndMapToListingIdByUserIdx,
} from "./utils";

const log = console.log;

export const trainData = async () => {
  log(
    "============================================================================",
    "========================== COLLABORATE FILTERING ===========================",
    "============================================================================"
  );

  const ratings = await transferDataToMatrix();

  log("ratings", ratings.length);

  const coMatrix = recommendation.coMatrix(ratings) as math.Matrix;

  const rec1 = await getRecommendAndMapToListingIdByUserIdx(
    ratings,
    coMatrix,
    1
  );
};
