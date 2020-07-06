import * as math from "mathjs";
import {
  typeCheckRating,
  checkRatingValues,
  typeCheckCoOccurrenceMatrix,
  typeCheckUserIndex,
  getRatingItemsForUsers,
} from "./utils";

const ONLY_RECOMMEND_FROM_SIMILAR_TASTE = 1;
const NORMALIZE_ON_POPULARITY = 1;
const log = console.log;

const createCoMatrix = (ratingMatrix: any[]) => {
  typeCheckRating(ratingMatrix);

  let matrix;
  try {
    matrix = math.matrix(ratingMatrix);
  } catch (error) {
    throw new Error("Dimension error in ratings matrix");
  }

  checkRatingValues(matrix);

  const userSize = matrix.size()[0];
  const itemSize = matrix.size()[1];

  const coMatrix = math.zeros(itemSize, itemSize) as math.Matrix;
  const normalizerMatrix = math.identity(itemSize) as math.Matrix;

  for (let y = 0; y < userSize; y++) {
    for (let x = 0; x < itemSize - 1; x++) {
      for (let index = x + 1; index < itemSize; index += 1) {
        // Co-occurrence
        if (ratingMatrix[y][x] === 1 && ratingMatrix[y][index] === 1) {
          coMatrix.set([x, index], coMatrix.get([x, index]) + 1);
          coMatrix.set([index, x], coMatrix.get([index, x]) + 1); // mirror
        }

        if (
          NORMALIZE_ON_POPULARITY &&
          (ratingMatrix[y][x] === 1 || ratingMatrix[y][index] === 1)
        ) {
          normalizerMatrix.set(
            [x, index],
            normalizerMatrix.get([x, index]) + 1
          );
          normalizerMatrix.set(
            [index, x],
            normalizerMatrix.get([index, x]) + 1
          );
        }
      }
    }
  }

  return coMatrix;
};

export const getRecommendations = (
  ratings: any[],
  coMatrix: math.Matrix,
  userIdx: number
) => {
  log("------- Get recommendations for user", userIdx);

  typeCheckRating(ratings);
  let ratingsMatrix;

  try {
    ratingsMatrix = math.matrix(ratings);
  } catch (error) {
    throw new Error("Dimension error in ratings matrix");
  }

  log("==== Rating Matrix", ratingsMatrix.toArray());

  const itemSize = ratingsMatrix.size()[1];

  typeCheckCoOccurrenceMatrix(coMatrix, itemSize);
  typeCheckUserIndex(userIdx, ratings);

  const ratedItemsForUser = getRatingItemsForUsers(ratings, userIdx, itemSize);

  const numRatedItems = ratedItemsForUser.length;

  const similarities = math.zeros(numRatedItems, itemSize) as math.Matrix;

  for (let rated = 0; rated < numRatedItems; rated += 1) {
    for (let item = 0; item < itemSize; item += 1) {
      similarities.set(
        [rated, item],
        coMatrix.get([ratedItemsForUser[rated], item]) +
          similarities.get([rated, item])
      );
    }
  }
  log("==== Similarities", similarities.toArray());

  const recommendations = math.zeros(itemSize) as math.Matrix;
  for (let y = 0; y < numRatedItems; y += 1) {
    for (let x = 0; x < itemSize; x += 1) {
      recommendations.set(
        [x],
        recommendations.get([x]) + similarities.get([y, x])
      );
    }
  }
  log("==== Recommendations", recommendations.toArray());

  const recommendation = math.dotDivide(
    recommendations,
    numRatedItems
  ) as math.MathType;

  const rec = recommendations.toArray() as any[];
  let recSorted = recommendations.toArray() as any[];

  recSorted.sort((a, b) => b - a);

  if (ONLY_RECOMMEND_FROM_SIMILAR_TASTE) {
    recSorted = recSorted.filter((element: any) => element !== 0);
  }

  let recOrder = recSorted.map((element) => {
    const index = rec.indexOf(element);
    rec[index] = null; // To ensure no duplicate indices in the future iterations.

    return index;
  });

  recOrder = recOrder.filter((index) => !ratedItemsForUser.includes(index));

  return recOrder;
};

export const collaborativeFilter = (ratings: any[], userIdx: number) => {
  if (!Array.isArray(ratings)) return false;

  const coMatrix = createCoMatrix(ratings);
  const recommendation = getRecommendations(ratings, coMatrix, userIdx);
  return recommendation;
};

export default {
  cFilter: collaborativeFilter,
  getRecommendations,
  coMatrix: createCoMatrix,
};
