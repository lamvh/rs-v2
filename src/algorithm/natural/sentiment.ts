import { getDataByCollection } from "../../utils/mongo";
import { collectionsEnum } from "../../types/enum";

export const updateSentimentFromUsers = async () => {
  const reviews = await getDataByCollection({
    collection: collectionsEnum.reviewDetails,
    limit: 1000,
  });
};
