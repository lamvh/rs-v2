import recommendation from "./lib/algorithm";
import {
  transferDataToMatrix,
  getRecommendAndMapToListingIdByUserIdx,
} from "./utils";
import { getReviewersFromReviewDetails } from "../../data/reviewer/reviewer";
import Bluebird from "bluebird";
import { result } from "lodash";

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

export const getRecommendForAllUserByCFAlgorithm = async (): Promise<any[]> => {
  console.log("--- Get recommend for all user");
  const { uniq } = await getReviewersFromReviewDetails();
  const reviewerIds = uniq.map((reviewer) => reviewer.id);

  const ratings = await transferDataToMatrix();
  const coMatrix = recommendation.coMatrix(ratings) as math.Matrix;

  const data: any[] = [];
  await Bluebird.each(reviewerIds, async (reviewerId, index) => {
    const result = await getRecommendAndMapToListingIdByUserIdx(
      ratings,
      coMatrix,
      index
    );

    console.log(result);

    if (result) {
      data.push({
        id: reviewerId,
        recommend: result,
        type: "cf",
      });
    }
  });

  console.log("---- Found", result.length, "recommend user by CF algorithm");
  return data;
};
