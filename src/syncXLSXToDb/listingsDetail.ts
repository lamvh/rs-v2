import { syncCollection } from "../utils/mongo";
import { getRawDataFromXLSX } from "../utils/xlsx";
import { syncDataToMongoCloudV2 } from "../utils/syncData";

export const syncListingDetailToMongoDBV2 = async () => {
  const collectionName = "listingDetails";

  const col = await syncCollection(collectionName);

  const data = await getRawDataFromXLSX({
    fileName: "listingsDetail",
    sheetName: "listingsDetail",
  });

  await syncDataToMongoCloudV2(data, col);

  console.log("Listing Detail Done");
};
