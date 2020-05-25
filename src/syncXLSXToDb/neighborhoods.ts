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

<<<<<<< HEAD
  await syncDataToMongoCloudV2(data!, col);
=======
  await syncDataToMongoCloud(data!, col, 100);
>>>>>>> a0d153c2de0daa33fb1e9c4de2d0c5ee0d0e5823

  console.log("Neighbourhood Done !");
};
