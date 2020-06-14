import { collection } from "../utils/mongo";
import { getRawDataFromXLSX } from "../utils/xlsx";
import { syncDataToMongoCloudV2 } from "../utils/syncData";

export const syncListingDetailToMongoDBV2 = async () => {
  const collectionName = "listingDetails";

  const col = await collection(collectionName);

  const data = await getRawDataFromXLSX({
    fileName: "listingDetails",
    sheetName: "listingDetails",
  });

  await syncDataToMongoCloudV2(data, col);

  console.log("Listing Detail Done");
};
