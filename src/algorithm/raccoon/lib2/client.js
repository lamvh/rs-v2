"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ioredis_1 = tslib_1.__importDefault(require("ioredis"));
exports.createClient = (redisPort, redisUrl, redisAuth) => {
  const client = new ioredis_1.default(redisPort, redisUrl);
  if (redisAuth) {
    client.auth(redisAuth, function (err) {
      if (err) {
        throw err;
      }
    });
  }
  return client;
};
//# sourceMappingURL=client.js.map
