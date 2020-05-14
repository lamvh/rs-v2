import { collection, syncDataToMongoCloudV2 } from "../utils/mongo";
import { getRawDataFromXLSX } from "../utils/xlsx";

export const syncListingDetailToMongoDBV2 = async () => {
  const collectionName = "listingDetails";

  const col = await collection(collectionName);

  const data = await getRawDataFromXLSX({
    fileName: "listingsDetail",
    sheetName: "listingsDetail",
  });

  await syncDataToMongoCloudV2(data, col);

  console.log("Listing Done");
};
