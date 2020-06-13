import getSentiment from "../utils/sentimentAnalysis";
import stem from "../utils/stem";

export const getSentimentFromText = async (text: string) => {
  return await getSentiment(await stem(text));
};
