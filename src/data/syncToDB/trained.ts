import { collectionsEnum } from "../../types/enum";
import Bluebird from "bluebird";
import { collection } from "../../utils/mongo";

export const updateTrainedDataToMongoDB = async (data: any[]) => {
  console.log("--- Starting update trained data to mongodb");

  if (!data || data.length === 0) {
    throw Error("!!!! No trained data to update !");
  }

  const col = await collection(collectionsEnum.trained);

  await Bluebird.each(data, async (row, index) => {
    console.log(
      "updating trained ",
      index + 1,
      "/",
      data.length,
      row.type,
      row.id
    );

    try {
      await col.findOneAndUpdate(
        { id: row.id, type: row.type },
        { $set: row },
        { upsert: true }
      );
    } catch (error) {
      let count = 1;
      while (count < 5) {
        await col.findOneAndUpdate(
          { id: row.id },
          { $set: row },
          { upsert: true }
        );
        console.log("Retry insert", count, "time");
        count = count + 1;
      }
      console.log(error);
    }
    await Bluebird.delay(50);
  });

  console.log("--- Updated trained data");
};
