import mongoose from "mongoose";

export const syncDataToMongoCloudV2 = async (
  data: any[],
  collectionConnected: mongoose.Collection
) => {
  try {
    console.log(data.length);
    await collectionConnected.insertMany(data);
  } catch (error) {
    let count = 1;
    while (count < 5) {
      await collectionConnected.insertMany(data);
      console.log("Retry insert", count, "time");
      count = count + 1;
    }
  }
};
