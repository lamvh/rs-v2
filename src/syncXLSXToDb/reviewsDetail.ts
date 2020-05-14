import { collection, syncDataToMongoCloudV2 } from "../utils/mongo";
import { getRawDataFromXLSX } from "../utils/xlsx";

export const syncReviewDetailToMongoDBV2 = async () => {
  const collectionName = "reviewDetails";

  const col = await collection(collectionName);

  const data = await getRawDataFromXLSX({
    fileName: "reviewsDetail",
    sheetName: "reviewsDetail",
  });

  await syncDataToMongoCloudV2(data, col);

  console.log("Listing Done");
};
