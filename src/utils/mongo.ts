import mongoose from "mongoose";
import { collectionsEnum } from "../types/enum";

let database: mongoose.Connection;

let uri = process.env.MONGO_LOCAL_URI;

if (process.env.NODE_ENV === "production") {
  uri = process.env.MONGO_CLOUD_URI;
}

export const connect = async (): Promise<mongoose.Connection> => {
  if (!uri) {
    console.error("No MONGO_URI config");
    throw Error("! ! ! No MONGO_URI config");
  }

  try {
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    database = mongoose.connection;
    database.once("open", async () => {
      console.info("- - - Connected MongoDB");
    });

    database.on("error", () => {
      console.error("! ! ! Error connecting to database");
    });

    return database;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const disconnect = () => {
  if (!database) {
    return;
  }
  mongoose.disconnect();
};

export const syncCollection = async (collectionName: string) => {
  console.log("starting sync collection", collectionName);
  const connection = await connect();

  if (connection.collection(collectionName)) {
    await connection.dropCollection(collectionName);
  }
  await connection.createCollection(collectionName);

  const collectionConnected = connection.collection(collectionName);

  if (!collectionConnected) {
    console.log("Can not connect to", collectionName, "collection");
  }
  return collectionConnected;
};

export const collection = async (
  collectionName: string
): Promise<mongoose.Collection> => {
  const connection = await connect();
  const collectionConnected = connection.collection(collectionName);

  if (!collectionConnected) {
    console.log("Can not connect to", collectionName, "collection");
  }

  return collectionConnected;
};

export const getDataByCollection = async (opt: {
  collection: collectionsEnum;
  limit?: number;
}) => {
  const limit = opt.limit ?? 1000000;

  const col = await collection(opt.collection);

  const data = col.find().limit(limit).toArray();

  if (!data || (await data).length === 0) {
    throw new Error(`!!! Data not found ${opt.collection}`);
  }

  return data;
};

export const getReviewDetailData = async (limit: number = 1000) => {
  return await getDataByCollection({
    collection: collectionsEnum.reviewDetails,
    limit,
  });
};
