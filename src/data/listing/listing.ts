import { listingDetail } from "../../types/listingDetail";
import { getDataByCollection } from "../../utils/mongo";
import { collectionsEnum } from "../../types/enum";

export const getListings = async (
  limit: number = 1000
): Promise<listingDetail[]> => {
  return await getDataByCollection({
    collection: collectionsEnum.listingDetails,
    limit,
  });
};
