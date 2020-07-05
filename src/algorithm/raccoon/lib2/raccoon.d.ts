import Config, { ConfigArgs } from "./config";
import { Redis } from "ioredis";
import { UpdateRecsOptions } from "./input";

export default class Raccoon {
  config: Config;
  client: Redis;
  constructor(config: ConfigArgs);

  liked(
    userId: string,
    itemId: string,
    options?: UpdateRecsOptions
  ): Promise<void>;

  disliked(
    userId: string,
    itemId: string,
    options?: UpdateRecsOptions
  ): Promise<void>;

  unliked(
    userId: string,
    itemId: string,
    options?: UpdateRecsOptions
  ): Promise<void>;

  undisliked(
    userId: string,
    itemId: string,
    options?: UpdateRecsOptions
  ): Promise<void>;

  updateSimilarityFor(userId: string): Promise<void>;

  predictFor(userId: string, itemId: string): Promise<number>;

  similaritySum(simSet: string, compSet: string): Promise<number>;

  updateRecommendationsFor(userId: string): Promise<void>;

  updateWilsonScore(itemId: string): Promise<void>;

  recommendFor(userId: string, numberOfRecs: number): Promise<string[]>;

  recommendForWithScores(
    userId: string,
    numberOfRecs: number
  ): Promise<[string, number][]>;

  bestRated(): Promise<string[]>;

  worstRated(): Promise<string[]>;

  bestRatedWithScores(numOfRatings: number): Promise<[string, number][]>;

  mostLiked(): Promise<string[]>;

  mostDisliked(): Promise<string[]>;

  mostSimilarUsers(userId: string): Promise<string[]>;

  leastSimilarUsers(userId: string): Promise<string[]>;

  likedBy(itemId: string): Promise<string[]>;

  likedCount(itemId: string): Promise<number>;

  dislikedBy(itemId: string): Promise<string[]>;

  dislikedCount(itemId: string): Promise<number>;

  allLikedFor(userId: string): Promise<string[]>;

  allDislikedFor(userId: string): Promise<string[]>;

  allWatchedFor(userId: string): Promise<string[]>;

  close(): void;
}
