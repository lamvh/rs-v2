import { collection } from "../../utils/mongo";
import { getRawDataFromXLSX } from "../../utils/xlsx";
import { syncDataToMongoCloudV2 } from "../../utils/syncData";
import { collectionsEnum } from "../../types/enum";

export const syncListingToMongoDBV2 = async () => {
  const col = await collection(collectionsEnum.listings);

  const data = await getRawDataFromXLSX({
    fileName: "listings",
    sheetName: "listings",
  });

  if (data && data.length > 0) {
    await syncDataToMongoCloudV2(data, col);
  }

  console.log("Listing Done");
};
