"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const key_1 = require("./key");
const algorithms_1 = require("./algorithms");
const updateSequence = async function (client, config, userId, itemId) {
    // let updateWilson = true;
    // if ('updateWilson' in options) {
    //   updateWilson = options.updateWilson ? true : false;
    // }
    await algorithms_1.updateSimilarityFor(client, config.className, userId);
    return Promise.all([
        algorithms_1.updateWilsonScore(client, config.className, itemId),
        algorithms_1.updateRecommendationsFor(client, config.className, config.nearestNeighbors, config.numOfRecsStore, userId)
    ]);
};
const changeRating = async function (client, config, userId, itemId, options) {
    let updateRecommendations = true;
    if (options.updateRecs !== undefined) {
        updateRecommendations = !!options.updateRecs;
    }
    const removeRating = !!options.removeRating;
    const feelingItemSet = options.liked
        ? key_1.itemLikedBySetKey(config.className, itemId)
        : key_1.itemDislikedBySetKey(config.className, itemId);
    const feelingUserSet = options.liked
        ? key_1.userLikedSetKey(config.className, userId)
        : key_1.userDislikedSetKey(config.className, userId);
    const mostFeelingSet = options.liked
        ? key_1.mostLikedKey(config.className)
        : key_1.mostDislikedKey(config.className);
    const result = await client.sismember(feelingItemSet, userId);
    if (result === 0 && !removeRating) {
        await client.zincrby(mostFeelingSet, 1, itemId);
    }
    else if (result > 0 && removeRating) {
        await client.zincrby(mostFeelingSet, -1, itemId);
    }
    removeRating
        ? await client.srem(feelingUserSet, itemId)
        : await client.sadd(feelingUserSet, itemId);
    removeRating
        ? await client.srem(feelingItemSet, userId)
        : await client.sadd(feelingItemSet, userId);
    const result2 = await client.sismember(feelingItemSet, userId);
    if (updateRecommendations && result2 > 0) {
        await updateSequence(client, config, userId, itemId);
    }
};
exports.liked = function (client, config, userId, itemId, options = {}) {
    return changeRating(client, config, userId, itemId, Object.assign(Object.assign({}, options), { liked: true }));
};
exports.disliked = function (client, config, userId, itemId, options = {}) {
    return changeRating(client, config, userId, itemId, Object.assign(Object.assign({}, options), { liked: false }));
};
exports.unliked = function (client, config, userId, itemId, options = {}) {
    return changeRating(client, config, userId, itemId, Object.assign(Object.assign({}, options), { liked: true, removeRating: true }));
};
exports.undisliked = function (client, config, userId, itemId, options = {}) {
    return changeRating(client, config, userId, itemId, Object.assign(Object.assign({}, options), { liked: false, removeRating: true }));
};
//# sourceMappingURL=input.js.map