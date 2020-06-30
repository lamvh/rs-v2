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

export default getSentiments;
