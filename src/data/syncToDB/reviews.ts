import { collection } from "../../utils/mongo";
import { getRawDataFromXLSX } from "../../utils/xlsx";
import { syncDataToMongoCloudV2 } from "../../utils/syncData";
import { collectionsEnum } from "../../types/enum";

export const syncReviewToMongoDBV2 = async () => {
  const col = await collection(collectionsEnum.reviews);

  const data = await getRawDataFromXLSX({
    fileName: "reviews",
    sheetName: "reviews",
  });

  if (data && data.length > 0) {
    await syncDataToMongoCloudV2(data, col);
  }

  console.log("Review Done");
};
