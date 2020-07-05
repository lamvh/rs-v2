"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Config {
  constructor({
    nearestNeighbors,
    className,
    numOfRecsStore,
    factorLeastSimilarLeastLiked,
    redisUrl,
    redisPort,
    redisAuth,
  }) {
    this.nearestNeighbors = nearestNeighbors || 5;
    this.className = className || "movie";
    this.numOfRecsStore = numOfRecsStore || 30;
    this.factorLeastSimilarLeastLiked = factorLeastSimilarLeastLiked || false;
    this.redisUrl = redisUrl || process.env.RACCOON_REDIS_URL || "127.0.0.1";
    this.redisPort =
      redisPort ||
      (process.env.RACCOON_REDIS_PORT
        ? parseInt(process.env.RACCOON_REDIS_PORT)
        : 6379);
    this.redisAuth = redisAuth || process.env.RACCOON_REDIS_AUTH || "";
  }
}
exports.default = Config;
//# sourceMappingURL=config.js.map
