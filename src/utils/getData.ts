import { connect, collection } from "./mongo";

export const getDataByCollection = async (opt: {
  collection: string;
  limit?: number;
}) => {
  console.log("Get data from collection", opt.collection);
  try {
    const data = await (await collection(opt.collection)).find().toArray();

    if (!data) {
      console.log("no data");
    }

    console.log("found ", data.length, "document");
    console.log("example", data[0]);

    return data;
  } catch (error) {
    throw error;
  }
};
