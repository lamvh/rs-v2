"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const p_map_1 = tslib_1.__importDefault(require("p-map"));
const key_1 = require("./key");
// the jaccard coefficient outputs an objective measurement of the similarity between two objects. in this case, two users. the coefficient
// is the result of summing the two users likes/dislikes incommon then summing they're likes/dislikes that they disagree on. this sum is
// then divided by the number of items they both reviewed.
const jaccardCoefficient = async function (
  client,
  className,
  userId1,
  userId2
) {
  // finalJaccard = 0,
  const user1LikedSet = key_1.userLikedSetKey(className, userId1);
  const user1DislikedSet = key_1.userDislikedSetKey(className, userId1);
  const user2LikedSet = key_1.userLikedSetKey(className, userId2);
  const user2DislikedSet = key_1.userDislikedSetKey(className, userId2);
  // retrieving a set of the users likes incommon
  const results1 = await client.sinter(user1LikedSet, user2LikedSet);
  const results2 = await client.sinter(user1DislikedSet, user2DislikedSet);
  const results3 = await client.sinter(user1LikedSet, user2DislikedSet);
  const results4 = await client.sinter(user1DislikedSet, user2LikedSet);

  const similarity =
    results1.length + results2.length - results3.length - results4.length;

  // calculating the number of movies rated incommon
  const ratedInCommon =
    results1.length + results2.length + results3.length + results4.length;
  // calculating the the modified jaccard score. similarity / num of comparisons made incommon
  const finalJaccardScore = similarity / ratedInCommon;

  // calling the callback function passed to jaccard with the new score
  return finalJaccardScore;
};

// this function updates the similarity for one user versus all others. at scale this probably needs to be refactored to compare a user
// against clusters of users instead of against all. every comparison will be a value between -1 and 1 representing simliarity.
// -1 is exact opposite, 1 is exactly the same.

exports.updateSimilarityFor = async function (client, className, userId) {
  // turning the userId into a string. depending on the db they might send an object, in which it won't compare properly when comparing
  // to other users
  // userId = String(userId)
  // initializing variables
  let itemLikeDislikeKeys = [];
  // setting the redis key for the user's similarity set
  const similarityZSet = key_1.similarityZSetKey(className, userId);
  // creating a combined set with the all of a users likes and dislikes
  const userRatedItemIds = await client.sunion(
    key_1.userLikedSetKey(className, userId),
    key_1.userDislikedSetKey(className, userId)
  );

  // if they have rated anything
  if (userRatedItemIds.length > 0) {
    // creating a list of redis keys to look up all of the likes and dislikes for a given set of items
    itemLikeDislikeKeys = userRatedItemIds
      .map(function (itemId) {
        // key for that item being liked
        const itemLiked = key_1.itemLikedBySetKey(className, itemId);
        // key for the item being disliked
        const itemDisliked = key_1.itemDislikedBySetKey(className, itemId);
        // returning an array of those keys
        return [itemLiked, itemDisliked];
      })
      .flat();
  }
  // flattening the array of all the likes/dislikes for the items a user rated
  // itemLikeDislikeKeys = _.flatten(itemLikeDislikeKeys);
  // builds one set of all the users who liked and disliked the same items
  const otherUserIdsWhoRated = await client.sunion(...itemLikeDislikeKeys);
  await p_map_1.default(otherUserIdsWhoRated, async (otherUserId) => {
    // if there is only one other user or the other user is the same user
    if (otherUserIdsWhoRated.length === 1 || userId === otherUserId) {
      // then call the callback and exciting the similarity check
      return;
    }
    // if the userid is not the same as the user
    if (userId !== otherUserId) {
      // calculate the jaccard coefficient for similarity. it will return a value between -1 and 1 showing the two users
      // similarity
      const result = await jaccardCoefficient(
        client,
        className,
        userId,
        otherUserId
      );
      await client.zadd(similarityZSet, result.toString(), otherUserId);
    }
  });
};

exports.predictFor = async function (client, className, userId, itemId) {
  // userId = String(userId);
  // itemId = String(itemId);
  let finalSimilaritySum = 0.0;
  const similarityZSet = key_1.similarityZSetKey(className, userId);
  const likedBySet = key_1.itemLikedBySetKey(className, itemId);
  const dislikedBySet = key_1.itemDislikedBySetKey(className, itemId);
  const result1 = await exports.similaritySum(
    client,
    similarityZSet,
    likedBySet
  );
  const result2 = await exports.similaritySum(
    client,
    similarityZSet,
    dislikedBySet
  );
  finalSimilaritySum = result1 - result2;
  const likedByCount = await client.scard(likedBySet);
  const dislikedByCount = await client.scard(dislikedBySet);
  const prediction = finalSimilaritySum / (likedByCount + dislikedByCount);
  if (isFinite(prediction)) {
    return prediction;
  } else {
    return 0.0;
  }
};
exports.similaritySum = async function (client, simSet, compSet) {
  let similarSum = 0.0;
  const userIds = await client.smembers(compSet);
  await p_map_1.default(
    userIds,
    async (userId) => {
      const zScore = await client.zscore(simSet, userId);
      const newScore = parseFloat(zScore) || 0.0;
      similarSum += newScore;
    },
    { concurrency: 1 }
  );
  return similarSum;
};
// after the similarity is updated for the user, the users recommendations are updated
// recommendations consist of a sorted set in Redis. the values of this set are
// names of the items and the score is what raccoon estimates that user would rate it
// the values are generally not going to be -1 or 1 exactly because there isn't 100%
// certainty.
exports.updateRecommendationsFor = async function (
  client,
  className,
  nearestNeighbors,
  numOfRecsStore,
  userId
) {
  // turning the user input into a string so it can be compared properly
  // userId = String(userId);
  // creating two blank arrays
  const setsToUnion = [];
  const scoreMap = [];
  // initializing the redis keys for temp sets, the similarity set and the recommended set
  const tempAllLikedSet = key_1.tempAllLikedSetKey(className, userId);
  const similarityZSet = key_1.similarityZSetKey(className, userId);
  const recommendedZSet = key_1.recommendedZSetKey(className, userId);
  const mostSimilarUserIds = await client.zrevrange(
    similarityZSet,
    0,
    nearestNeighbors - 1
  );
  const leastSimilarUserIds = await client.zrange(
    similarityZSet,
    0,
    nearestNeighbors - 1
  );
  // iterate through the user ids to create the redis keys for all those users likes
  mostSimilarUserIds.forEach(function (usrId) {
    setsToUnion.push(key_1.userLikedSetKey(className, usrId));
  });
  // if you want to factor in the least similar least likes, you change this in config
  // left it off because it was recommending items that every disliked universally
  leastSimilarUserIds.forEach(function (usrId) {
    setsToUnion.push(key_1.userDislikedSetKey(className, usrId));
  });
  // if there is at least one set in the array, continue
  if (setsToUnion.length > 0) {
    // setsToUnion.unshift(tempAllLikedSet);
    // await client.sunionstore(setsToUnion) //TODO: check
    await client.sunionstore(tempAllLikedSet, ...setsToUnion);
    const notYetRatedItems = await client.sdiff(
      tempAllLikedSet,
      key_1.userLikedSetKey(className, userId),
      key_1.userDislikedSetKey(className, userId)
    );
    await p_map_1.default(
      notYetRatedItems,
      async function (itemId) {
        const score = await exports.predictFor(
          client,
          className,
          userId,
          itemId
        );
        scoreMap.push([score, itemId]);
      },
      { concurrency: 1 }
    );
    await client.del(recommendedZSet);
    await p_map_1.default(
      scoreMap,
      async function (scorePair) {
        await client.zadd(
          recommendedZSet,
          scorePair[0].toString(),
          scorePair[1]
        );
      },
      { concurrency: 1 }
    );
    await client.del(tempAllLikedSet);
    const length = await client.zcard(recommendedZSet);
    await client.zremrangebyrank(
      recommendedZSet,
      0,
      length - numOfRecsStore - 1
    );
  }
};

// the wilson score is a proxy for 'best rated'. it represents the best finding the best ratio of likes and also eliminating outliers. the wilson score is a value between 0 and 1.
exports.updateWilsonScore = async function (client, className, itemId) {
  // creating the redis keys for scoreboard and to get the items liked and disliked sets
  const scoreboard = key_1.scoreboardZSetKey(className);
  const likedBySet = key_1.itemLikedBySetKey(className, itemId);
  const dislikedBySet = key_1.itemDislikedBySetKey(className, itemId);
  // used for a confidence interval of 95%
  const z = 1.96;
  // initializing variables to calculate wilson score
  let n, pOS, score;
  const likedResults = await client.scard(likedBySet);
  const dislikedResults = await client.scard(dislikedBySet);
  if (likedResults + dislikedResults > 0) {
    // set n to the sum of the total ratings for the item
    n = likedResults + dislikedResults;
    // set pOS to the num of liked results divided by the number rated
    // pOS represents the proportion of successes or likes in this case
    // pOS = likedResults / parseFloat(n);
    pOS = likedResults / n;
    // try the following equation
    try {
      // calculating the wilson score
      // http://www.evanmiller.org/how-not-to-sort-by-average-rating.html
      score =
        (pOS +
          (z * z) / (2 * n) -
          z * Math.sqrt((pOS * (1 - pOS) + (z * z) / (4 * n)) / n)) /
        (1 + (z * z) / n);
    } catch (e) {
      // if an error occurs, set the score to 0.0 and console log the error message.
      console.log(e.name + ": " + e.message);
      score = 0.0;
    }
    // add that score to the overall scoreboard. if that item already exists, the score will be updated.
    await client.zadd(scoreboard, score.toString(), itemId);
  }
};
//# sourceMappingURL=algorithms.js.map
