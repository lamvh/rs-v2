import Redis from "ioredis";

export declare const createClient: (
  redisPort: number,
  redisUrl: string,
  redisAuth?: string | undefined
) => Redis.Redis;
