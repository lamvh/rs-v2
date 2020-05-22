import { getDataByCollection } from "../utils/mongo";
import { collectionsEnum } from "../types/enum";

// tslint:disable-next-line: no-var-requires
const ContentBasedRecommender = require("content-based-recommender");

const limit = 1000;

const getData = async () => {
  const data = await getDataByCollection({
    collection: collectionsEnum.listingsDetail,
    limit,
  });
  console.log(data);

  return data;
};
