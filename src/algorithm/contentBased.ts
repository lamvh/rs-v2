import { getDataByCollection } from "../utils/mongo";
import { collectionsEnum } from "../types/enum";
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
