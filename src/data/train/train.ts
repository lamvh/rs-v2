import { getRecommendForAllUserByCFAlgorithm } from "../../algorithm/collaborateFiltering/collaborateFiltering";
import { updateTrainedDataToMongoDB } from "../syncToDB/trained";
import initRedis from "../../utils/redis";
import { getReviewWithFakedData } from "../review/review";
import { getRecommendForAllUser } from "../../algorithm/raccoon/utils";
import { collectionsEnum } from "../../types/enum";
import { collection } from "../../utils/mongo";

export const trainAndUpdateTrainDataToMongoDB = async () => {
  // --------------------------------------------
  // ----- Collaborate Filtering Algorithm ------
  // --------------------------------------------
  // const data = await getRecommendForAllUserByCFAlgorithm();
  // updateTrainedDataToMongoDB(data);

  // -----------------------------------
  // ------ Raccoon Algorithm ---------
  // -----------------------------------
  const rac = await initRedis();
  const reviews = await getReviewWithFakedData();

  const raccoonData = await getRecommendForAllUser(rac, reviews);
  updateTrainedDataToMongoDB(raccoonData);
};

export const getRecommendListingByUserId = async (id: number, type: string) => {
  const col = await collection(collectionsEnum.trained);
  const rec = await col.findOne({ id, type });

  return rec.recommend;
};

trainAndUpdateTrainDataToMongoDB();
