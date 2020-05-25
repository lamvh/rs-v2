import { getDataByCollection, getDataFromJSON } from "../utils/getData";
import { collectionsEnum } from "../types/enum";

// tslint:disable-next-line: no-var-requires
const ContentBasedRecommender = require("content-based-recommender");

const limit = 1000;

const trainData = async (data: any[]) => {
  console.log("starting training data");
  const recommender = new ContentBasedRecommender({
    minScore: 0.1,
    maxSimilarDocuments: 100,
  });

  await recommender.train(data);

  const similarDocuments = recommender.getSimilarDocuments("1000002", 0, 10);

  console.log(similarDocuments);
};

export const contentBased = async () => {
  // const data = await getDataFromJSON("calendars");
  const data = await getDataFromJSON("reviewDetails");

  const a = await data
    .slice(1, 1000)
    .map((row: any) => ({ id: row.id, content: row.comments }));
  await trainData(a);
};
