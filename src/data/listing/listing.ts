import { listingDetail } from "../../types/listingDetail";
import { getDataByCollection } from "../../utils/mongo";
import { collectionsEnum } from "../../types/enum";
import { collection } from "../../utils/mongo";

export const getListings = async (
  limit: number = 1000
): Promise<listingDetail[]> => {
  return await getDataByCollection({
    collection: collectionsEnum.listingDetails,
    limit,
  });
};

export const getListingById = async (id: number): Promise<listingDetail> => {
  const col = await collection(collectionsEnum.listingDetails);

  const data = await col.findOne({ id });

  if (!data) {
    throw new Error(`Listing ${id} not found`);
  }
  return data;
};
