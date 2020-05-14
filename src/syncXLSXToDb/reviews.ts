import { collection, syncDataToMongoCloudV2 } from "../utils/mongo";
import { getRawDataFromXLSX } from "../utils/xlsx";

export const syncReviewToMongoDBV2 = async () => {
  const collectionName = "reviews";

  const col = await collection(collectionName);

  const data = await getRawDataFromXLSX({
    fileName: "reviews",
    sheetName: "reviews",
  });

  await syncDataToMongoCloudV2(data, col);

  console.log("Review Done");
};
