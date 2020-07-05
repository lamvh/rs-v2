export declare function userLikedSetKey(
  className: string,
  userId: string
): string;

export declare function userDislikedSetKey(
  className: string,
  userId: string
): string;

export declare function itemLikedBySetKey(
  className: string,
  itemId: string
): string;

export declare function itemDislikedBySetKey(
  className: string,
  itemId: string
): string;

export declare function mostLikedKey(className: string): string;

export declare function mostDislikedKey(className: string): string;

export declare function recommendedZSetKey(
  className: string,
  userId: string
): string;

export declare function scoreboardZSetKey(className: string): string;

export declare function similarityZSetKey(
  className: string,
  userId: string
): string;

export declare function tempAllLikedSetKey(
  className: string,
  userId: string
): string;
