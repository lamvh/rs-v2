import { Redis } from "ioredis";
export declare const updateSimilarityFor: (
  client: Redis,
  className: string,
  userId: string
) => Promise<void>;

export declare const predictFor: (
  client: Redis,
  className: string,
  userId: string,
  itemId: string
) => Promise<number>;

export declare const similaritySum: (
  client: Redis,
  simSet: string,
  compSet: string
) => Promise<number>;

export declare const updateRecommendationsFor: (
  client: Redis,
  className: string,
  nearestNeighbors: number,
  numOfRecsStore: number,
  userId: string
) => Promise<void>;

export declare const updateWilsonScore: (
  client: Redis,
  className: string,
  itemId: string
) => Promise<void>;
