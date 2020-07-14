import { collection } from "../../utils/mongo";
import { getRawDataFromXLSX } from "../../utils/xlsx";
import { syncDataToMongoCloudV2 } from "../../utils/syncData";
import { collectionsEnum } from "../../types/enum";

export const syncReviewDetailToMongoDBV2 = async () => {
  const col = await collection(collectionsEnum.reviewDetails);

  const data = await getRawDataFromXLSX({
    fileName: "reviewDetails",
    sheetName: "reviewDetails",
  });

  if (data && data.length > 0) {
    await syncDataToMongoCloudV2(data, col);
  }

  console.log("Review Detail Done !");
};
