import { collection } from "../../utils/mongo";
import { getRawDataFromXLSX } from "../../utils/xlsx";
import { syncDataToMongoCloudV2 } from "../../utils/syncData";

export const syncListingToMongoDBV2 = async () => {
  const collectionName = "listings";

  const col = await collection(collectionName);

  const data = await getRawDataFromXLSX({
    fileName: "listings",
    sheetName: "listings",
  });

  await syncDataToMongoCloudV2(data, col);

  console.log("Listing Done");
};
