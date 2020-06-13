// https:// github.com/Jordanirabor/nlp-node-natural-article/blob/master/src/sentiment-analysis/index.js

const natural = require("natural");

const Analyzer = natural.SentimentAnalyzer;
const stemmer = natural.PorterStemmer;
const analyzer = new Analyzer("English", stemmer, "afinn");

const getSentiment = (array: string[]) => {
  const sentiment = analyzer.getSentiment(array);
  console.log("--- Sentiment: ", sentiment);

  return sentiment;
};

export default getSentiment;
