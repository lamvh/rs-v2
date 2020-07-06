import * as math from "mathjs";
import { isEqual, isArray } from "lodash";

const normalizeMatrix = (matrix: number[][], normalize: number[][]) => {
  // Document of dotDivide: https://mathjs.org/docs/reference/functions/dotDivide.html
  return math.dotDivide(matrix, normalize);
};

const getRatingItemsForUsers = (
  rating: any[],
  userIdx: number,
  itemCount: any
) => {
  const ratedItems: any[][] = [];
};

const isArraysEqual = (arr1: any[], arr2: any[]) => {
  return isEqual(arr1.sort(), arr2.sort());
};

const typeCheckRating = (ratings: any[]) => {
  if (!isArray(ratings)) {
    throw new TypeError(
      "The ratings and coMatrix field should be an array of arrays (matrix)"
    );
  }
};

const typeCheckMatrix = (matrix: math.Matrix, itemCount: number) => {
  if (!(matrix instanceof math.matrix)) {
    throw new TypeError("Matrix is not type as mathjs Matrix");
  }

  if (!isArraysEqual(matrix.size(), [itemCount, itemCount])) {
    throw new RangeError(
      "Co matrix has wrong dimensions. Make sure to generate it using createCoMatrix"
    );
  }
};

const checkRatingValues = (matrix: math.Matrix) => {
  const allowRating = [0, 1];
  matrix.forEach((value) => {
    if (!Number.isInteger(value) || !allowRating.includes(value)) {
      throw new TypeError(
        "Wrong rating in rating array. Currently permitted values are 0 and 1"
      );
    }
  });
  return true;
};

const createMatrix = (ratingMatrix: any[]) => {
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

  const coMatrix = math.zeros(itemSize, itemSize);

  const normalizerMatrix = math.identity(itemSize);

  for (let y = 0; y < userSize; y++) {
    for (let x = 0; x < itemSize - 1; x++) {
      // for(let )
    }
  }
};
