import { syncCollection } from "../utils/mongo";
import { getRawDataFromXLSX } from "../utils/xlsx";
import { syncDataToMongoCloudV2 } from "../utils/syncData";

export const syncReviewDetailToMongoDBV2 = async () => {
  const collectionName = "reviewDetails";

  const col = await syncCollection(collectionName);

  const data = await getRawDataFromXLSX({
    fileName: "reviewsDetail",
    sheetName: "reviewsDetail",
  });

  await syncDataToMongoCloudV2(data, col);

  console.log("Review Detail Done !");
};
