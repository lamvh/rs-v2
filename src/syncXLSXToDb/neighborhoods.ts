import { syncCollection } from "../utils/mongo";
import { getRawDataFromXLSX } from "../utils/xlsx";
import { syncDataToMongoCloudV2 } from "../utils/syncData";

export const syncNeighborhoodsToMongoDB = async () => {
  const collectionName = "neighbourhoods";
  const col = await syncCollection(collectionName);

  const data = await getRawDataFromXLSX({
    fileName: "neighbourhoods",
    sheetName: "neighbourhoods",
  });

  await syncDataToMongoCloudV2(data!, col);

  console.log("Neighbourhood Done !");
};
