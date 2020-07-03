// Example: https:// github.com/Jordanirabor/nlp-node-natural-article/blob/master/src/sentiment-analysis/index.js

// sentiment max: 4
// sentiment min: -1

import { getDataByCollection } from "../../utils/mongo";
import { collectionsEnum } from "../../types/enum";
const natural = require("natural");

export const updateSentimentFromUsers = async () => {
  return await getDataByCollection({
    collection: collectionsEnum.reviewDetails,
    limit: 1000,
  });
};

const getSentiments = (array: string[]) => {
  const Analyzer = natural.SentimentAnalyzer;

  const stemmer = natural.PorterStemmer;

  const analyzer = new Analyzer("English", stemmer, "afinn");

  const sentiment = analyzer.getSentiment(array);

  console.log("--- Sentiment: ", sentiment);

  return sentiment;
};

export const convertRatingStarFrom = async (
  sentiment: number
): Promise<number> => {
  let rating = 0;
  if (sentiment >= 4) rating = 5;

  if (sentiment >= 3 && sentiment < 4) rating = 4;

  if (sentiment >= 2 && sentiment < 3) rating = 3;

  if (sentiment >= 1 && sentiment < 2) rating = 2;

  if (sentiment >= 0 && sentiment < 1) rating = 1;

  return rating;
};

export default getSentiments;
