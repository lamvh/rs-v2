import { getRawDataFromXLSX } from "../utils/xlsx";
import {
  collection,
  syncDataToMongoCloud,
  syncDataToMongoCloudV2,
} from "../utils/mongo";

export const syncCalendarDetailToMongoDB = async () => {
  const collectionName = "calendarDetails";

  const col = await collection(collectionName);

  const data = await getRawDataFromXLSX({
    fileName: "calendarDetail",
    sheetName: "calendarDetail",
  });

  await syncDataToMongoCloud(data, col, 100);

  console.log("Calendar Detail Done");
};

export const syncCalendarDetailToMongoDBV2 = async () => {
  const collectionName = "calendarDetailsV2";

  const col = await collection(collectionName);

  const data = await getRawDataFromXLSX({
    fileName: "calendarDetail",
    sheetName: "calendarDetail",
  });

  await syncDataToMongoCloudV2(data, col);

  console.log("Calendar Detail Done");
};
