import { getDataByCollection } from "../utils/getData";
import { collectionsEnum } from "../types/enum";

// tslint:disable-next-line: no-var-requires
const ContentBasedRecommender = require("content-based-recommender");

const limit = 1000;

const trainData = async (data: any[]) => {
  const recommender = new ContentBasedRecommender({
    minScore: 0.1,
    maxSimilarDocuments: 100,
  });

  await recommender.train(data);

  const similarDocuments = recommender.getSimilarDocuments("1000002", 0, 10);

  console.log(similarDocuments);
};

export const contentBased = async () => {
  const data = await getDataByCollection({
    collection: collectionsEnum.reviews,
  });
  // await trainData(data);
};
