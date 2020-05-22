import { syncCollection, syncDataToMongoCloud } from "../utils/mongo";
import { getRawDataFromXLSX } from "../utils/xlsx";

export const syncNeighborhoodsToMongoDB = async () => {
  const collectionName = "neighbourhoods";
  const col = await syncCollection(collectionName);

  const data = await getRawDataFromXLSX({
    fileName: "neighbourhoods",
    sheetName: "neighbourhoods",
  });

  await syncDataToMongoCloud(data, col, 100);

  console.log("Neighbourhood Done !");
};
