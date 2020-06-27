import { listingDetail } from "../../types/listingDetail";
import { getDataByCollection } from "../../utils/mongo";
import { collectionsEnum } from "../../types/enum";

export const getListingDetailData = async (
  limit: number = 1000
): Promise<listingDetail[]> => {
  return await getDataByCollection({
    collection: collectionsEnum.listingDetails,
    limit,
  });
};
