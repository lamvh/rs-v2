import { Redis } from "ioredis";
import Config from "./config";

export declare type UpdateRecsOptions = {
  updateRecs?: boolean;
};

export declare const liked: (
  client: Redis,
  config: Config,
  userId: string,
  itemId: string,
  options?: UpdateRecsOptions
) => Promise<void>;

export declare const disliked: (
  client: Redis,
  config: Config,
  userId: string,
  itemId: string,
  options?: UpdateRecsOptions
) => Promise<void>;

export declare const unliked: (
  client: Redis,
  config: Config,
  userId: string,
  itemId: string,
  options?: UpdateRecsOptions
) => Promise<void>;

export declare const undisliked: (
  client: Redis,
  config: Config,
  userId: string,
  itemId: string,
  options?: UpdateRecsOptions
) => Promise<void>;
