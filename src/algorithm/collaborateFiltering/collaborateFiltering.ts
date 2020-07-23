import recommendation from "./lib/algorithm";
import {
  transferDataToMatrix,
  getRecommendAndMapToListingIdByUserIdx,
} from "./utils";
import { getReviewersFromReviewDetails } from "../../data/reviewer/reviewer";

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
  console.log(rec1);
};

export const getRecommendForUserByCFAlgorithm = async (userId: string) => {
  const { uniq } = await getReviewersFromReviewDetails();
  const reviewerIds = uniq.map((reviewer) => reviewer.id);

  const userIndex = reviewerIds.indexOf(+userId);

  if (!userIndex) {
    return [];
  }

  const ratings = await transferDataToMatrix();
  const coMatrix = recommendation.coMatrix(ratings) as math.Matrix;

  return await getRecommendAndMapToListingIdByUserIdx(
    ratings,
    coMatrix,
    userIndex
  );
};
