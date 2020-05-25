import mongoose from "mongoose";

// export const syncDataToMongoCloud = async (
//   data: any[],
//   collectionConnected: mongoose.Collection,
//   delay: number
// ) => {
//   await Promise.all(
//     await each(data, async (row, index) => {
//       try {
//         console.log(index + 1, "/", data.length);
//         await collectionConnected.insertOne(row);
//       } catch (error) {
//         let count = 1;
//         while (count < 5) {
//           await collectionConnected.insertOne(row);
//           console.log("Retry insert", count, "time");
//           count = count + 1;
//         }
//       }
//       return Bluebird.delay(delay);
//     })
//   );
// };

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
