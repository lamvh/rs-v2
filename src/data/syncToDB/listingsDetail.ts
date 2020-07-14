import { collection } from "../../utils/mongo";
import { getRawDataFromXLSX } from "../../utils/xlsx";
import { syncDataToMongoCloudV2 } from "../../utils/syncData";
import { collectionsEnum } from "../../types/enum";

export const syncListingDetailToMongoDBV2 = async () => {
  const col = await collection(collectionsEnum.listingDetails);

  const data = await getRawDataFromXLSX({
    fileName: "listingDetails",
    sheetName: "listingDetails",
  });

  if (data && data.length > 0) {
    await syncDataToMongoCloudV2(data, col);
  }

  console.log("Listing Detail Done");
};
