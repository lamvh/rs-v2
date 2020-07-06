import * as math from "mathjs";
import { isEqual, isArray } from "lodash";

export const normalizeMatrix = (matrix: number[][], normalize: number[][]) => {
  // Document of dotDivide: https://mathjs.org/docs/reference/functions/dotDivide.html
  return math.dotDivide(matrix, normalize);
};

export const getRatingItemsForUsers = (
  ratings: any[],
  userIdx: number,
  itemCount: any
) => {
  const ratedItems: any[] = [];

  ratings[userIdx].map((rating: any, index: number) => {
    if (rating !== 0) {
      ratedItems.push(index);
    }
  });

  return ratedItems;
};

export const isArraysEqual = (arr1: any[], arr2: any[]) => {
  return isEqual(arr1.sort(), arr2.sort());
};

export const typeCheckRating = (ratings: any[]) => {
  if (!isArray(ratings)) {
    throw new TypeError(
      "The ratings and coMatrix field should be an array of arrays (matrix)"
    );
  }
};

export const typeCheckCoOccurrenceMatrix = (
  coMatrix: math.Matrix,
  itemSize: number
) => {
  if (!isArraysEqual(coMatrix.size(), [itemSize, itemSize])) {
    throw new RangeError(
      "Co matrix has wrong dimensions. Make sure to generate it using createCoMatrix"
    );
  }
};

export const typeCheckUserIndex = (userIdx: number, ratings: any[]) => {
  if (!Number.isInteger(userIdx)) {
    throw new TypeError("The field userIndex should be an integer");
  }
  if (userIdx < 0 || userIdx >= ratings.length) {
    throw new RangeError("User index out of range");
  }
};

export const checkRatingValues = (matrix: math.Matrix) => {
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
