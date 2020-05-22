import Bluebird, { each } from "bluebird";
import mongoose from "mongoose";

export const syncDataToMongoCloud = async (
  data: any[],
  collection: mongoose.Collection,
  delay: number
) => {
  await Promise.all(
    await each(data, async (row, index) => {
      try {
        console.log(index + 1, "/", data.length);
        await collection.insertOne(row);
      } catch (error) {
        let count = 1;
        while (count < 5) {
          await collection.insertOne(row);
          console.log("Retry insert", count, "time");
          count = count + 1;
        }
      }
      return Bluebird.delay(delay);
    })
  );
};

export const syncDataToMongoCloudV2 = async (
  data: any[],
  collection: mongoose.Collection
) => {
  try {
    console.log(data.length);
    await collection.insertMany(data);
  } catch (error) {
    let count = 1;
    while (count < 5) {
      await collection.insertMany(data);
      console.log("Retry insert", count, "time");
      count = count + 1;
    }
  }
};
