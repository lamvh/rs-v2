"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const config_1 = tslib_1.__importDefault(require("./config"));
const client_1 = require("./client");
const input_1 = require("./input");
const algorithms_1 = require("./algorithms");
const stat_1 = require("./stat");
class Raccoon {
    constructor(config) {
        this.config = new config_1.default(config);
        this.client = client_1.createClient(this.config.redisPort, this.config.redisUrl, this.config.redisAuth);
    }
    liked(userId, itemId, options = {}) {
        return input_1.liked(this.client, this.config, userId, itemId, options);
    }
    disliked(userId, itemId, options = {}) {
        return input_1.disliked(this.client, this.config, userId, itemId, options);
    }
    unliked(userId, itemId, options = {}) {
        return input_1.unliked(this.client, this.config, userId, itemId, options);
    }
    undisliked(userId, itemId, options = {}) {
        return input_1.undisliked(this.client, this.config, userId, itemId, options);
    }
    updateSimilarityFor(userId) {
        return algorithms_1.updateSimilarityFor(this.client, this.config.className, userId);
    }
    predictFor(userId, itemId) {
        return algorithms_1.predictFor(this.client, this.config.className, userId, itemId);
    }
    similaritySum(simSet, compSet) {
        return algorithms_1.similaritySum(this.client, simSet, compSet);
    }
    updateRecommendationsFor(userId) {
        return algorithms_1.updateRecommendationsFor(this.client, this.config.className, this.config.nearestNeighbors, this.config.numOfRecsStore, userId);
    }
    updateWilsonScore(itemId) {
        return algorithms_1.updateWilsonScore(this.client, this.config.className, itemId);
    }
    recommendFor(userId, numberOfRecs) {
        return stat_1.recommendFor(this.client, this.config.className, userId, numberOfRecs);
    }
    recommendForWithScores(userId, numberOfRecs) {
        return stat_1.recommendForWithScores(this.client, this.config.className, userId, numberOfRecs);
    }
    bestRated() {
        return stat_1.bestRated(this.client, this.config.className);
    }
    worstRated() {
        return stat_1.worstRated(this.client, this.config.className);
    }
    bestRatedWithScores(numOfRatings) {
        return stat_1.bestRatedWithScores(this.client, this.config.className, numOfRatings);
    }
    mostLiked() {
        return stat_1.mostLiked(this.client, this.config.className);
    }
    mostDisliked() {
        return stat_1.mostDisliked(this.client, this.config.className);
    }
    mostSimilarUsers(userId) {
        return stat_1.mostSimilarUsers(this.client, this.config.className, userId);
    }
    leastSimilarUsers(userId) {
        return stat_1.leastSimilarUsers(this.client, this.config.className, userId);
    }
    likedBy(itemId) {
        return stat_1.likedBy(this.client, this.config.className, itemId);
    }
    likedCount(itemId) {
        return stat_1.likedCount(this.client, this.config.className, itemId);
    }
    dislikedBy(itemId) {
        return stat_1.dislikedBy(this.client, this.config.className, itemId);
    }
    dislikedCount(itemId) {
        return stat_1.dislikedCount(this.client, this.config.className, itemId);
    }
    allLikedFor(userId) {
        return stat_1.allLikedFor(this.client, this.config.className, userId);
    }
    allDislikedFor(userId) {
        return stat_1.allDislikedFor(this.client, this.config.className, userId);
    }
    allWatchedFor(userId) {
        return stat_1.allWatchedFor(this.client, this.config.className, userId);
    }
    close() {
        this.client.disconnect();
    }
}
exports.default = Raccoon;
//# sourceMappingURL=raccoon.js.map