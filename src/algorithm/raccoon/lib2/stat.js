"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const key_1 = require("./key");
const lodash_1 = require("lodash");
const formatWithScoresResult = (result) => {
    return lodash_1.chunk(result, 2).map(([id, score]) => {
        const s = parseFloat(score);
        return [id, s];
    });
};
exports.recommendFor = function (client, className, userId, numberOfRecs) {
    return client.zrevrange(key_1.recommendedZSetKey(className, userId), 0, numberOfRecs);
};
exports.recommendForWithScores = async function (client, className, userId, numberOfRecs) {
    const recs = await client.zrevrange(key_1.recommendedZSetKey(className, userId), 0, numberOfRecs, 'WITHSCORES');
    return formatWithScoresResult(recs);
};
exports.bestRated = function (client, className) {
    return client.zrevrange(key_1.scoreboardZSetKey(className), 0, -1);
};
exports.worstRated = function (client, className) {
    return client.zrange(key_1.scoreboardZSetKey(className), 0, -1);
};
exports.bestRatedWithScores = async function (client, className, numOfRatings) {
    const ratings = await client.zrevrange(key_1.scoreboardZSetKey(className), 0, numOfRatings, 'WITHSCORES');
    return formatWithScoresResult(ratings);
};
exports.mostLiked = function (client, className) {
    return client.zrevrange(key_1.mostLikedKey(className), 0, -1);
};
exports.mostDisliked = function (client, className) {
    return client.zrevrange(key_1.mostDislikedKey(className), 0, -1);
};
exports.usersWhoLikedAlsoLiked = function (client, className, itemId) {
    console.log(itemId);
    throw new Error('not yet implement');
};
exports.mostSimilarUsers = function (client, className, userId) {
    return client.zrevrange(key_1.similarityZSetKey(className, userId), 0, -1);
};
exports.leastSimilarUsers = function (client, className, userId) {
    return client.zrange(key_1.similarityZSetKey(className, userId), 0, -1);
};
exports.likedBy = function (client, className, itemId) {
    return client.smembers(key_1.itemLikedBySetKey(className, itemId));
};
exports.likedCount = function (client, className, itemId) {
    return client.scard(key_1.itemLikedBySetKey(className, itemId));
};
exports.dislikedBy = function (client, className, itemId) {
    return client.smembers(key_1.itemDislikedBySetKey(className, itemId));
};
exports.dislikedCount = function (client, className, itemId) {
    return client.scard(key_1.itemDislikedBySetKey(className, itemId));
};
exports.allLikedFor = function (client, className, userId) {
    return client.smembers(key_1.userLikedSetKey(className, userId));
};
exports.allDislikedFor = function (client, className, userId) {
    return client.smembers(key_1.userDislikedSetKey(className, userId));
};
exports.allWatchedFor = function (client, className, userId) {
    return client.sunion(key_1.userLikedSetKey(className, userId), key_1.userDislikedSetKey(className, userId));
};
//# sourceMappingURL=stat.js.map