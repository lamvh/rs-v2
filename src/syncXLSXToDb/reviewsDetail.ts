import { syncCollection, collection } from "../utils/mongo";
import { getRawDataFromXLSX } from "../utils/xlsx";
import { syncDataToMongoCloudV2 } from "../utils/syncData";

export const syncReviewDetailToMongoDBV2 = async () => {
  const collectionName = "reviewDetails";

  const col = await collection(collectionName);

  const data = await getRawDataFromXLSX({
    fileName: "reviewDetails",
    sheetName: "reviewDetails",
  });

  await syncDataToMongoCloudV2(data, col);

  console.log("Review Detail Done !");
};
