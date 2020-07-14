import { getRawDataFromXLSX } from "../../utils/xlsx";
import { syncDataToMongoCloudV2 } from "../../utils/syncData";
import { collectionsEnum } from "../../types/enum";
import { collection } from "../../utils/mongo";

export const syncCalendarToMongoDBV2 = async () => {
  const collectionName = collectionsEnum.calendars;

  const col = await collection(collectionName);

  const data = await getRawDataFromXLSX({
    fileName: "calendars",
    sheetName: "calendars",
  });

  if (data && data.length > 0) {
    await syncDataToMongoCloudV2(data, col);
  }

  console.log("Calendar Done !");
};
