"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const USER = 'user';
const ITEM = 'item';
function joinKey(className, keyArr) {
    return [className].concat(keyArr).join(':');
}
function userLikedSetKey(className, userId) {
    return joinKey(className, [USER, userId, 'liked']);
}
exports.userLikedSetKey = userLikedSetKey;
function userDislikedSetKey(className, userId) {
    return joinKey(className, [USER, userId, 'disliked']);
}
exports.userDislikedSetKey = userDislikedSetKey;
function itemLikedBySetKey(className, itemId) {
    return joinKey(className, [ITEM, itemId, 'liked']);
}
exports.itemLikedBySetKey = itemLikedBySetKey;
function itemDislikedBySetKey(className, itemId) {
    return joinKey(className, [ITEM, itemId, 'disliked']);
}
exports.itemDislikedBySetKey = itemDislikedBySetKey;
function mostLikedKey(className) {
    return joinKey(className, ['mostLiked']);
}
exports.mostLikedKey = mostLikedKey;
function mostDislikedKey(className) {
    return joinKey(className, ['mostDisliked']);
}
exports.mostDislikedKey = mostDislikedKey;
function recommendedZSetKey(className, userId) {
    return joinKey(className, [USER, userId, 'recommendedZSet']);
}
exports.recommendedZSetKey = recommendedZSetKey;
function scoreboardZSetKey(className) {
    return joinKey(className, ['scoreboard']);
}
exports.scoreboardZSetKey = scoreboardZSetKey;
function similarityZSetKey(className, userId) {
    return joinKey(className, [USER, userId, 'similarityZSet']);
}
exports.similarityZSetKey = similarityZSetKey;
function tempAllLikedSetKey(className, userId) {
    return joinKey(className, [USER, userId, 'tempAllLikedSet']);
}
exports.tempAllLikedSetKey = tempAllLikedSetKey;
//# sourceMappingURL=key.js.map