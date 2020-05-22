import mongoose from "mongoose";
import Bluebird, { each } from "bluebird";

let database: mongoose.Connection;

export const connect = async (): Promise<mongoose.Connection> => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("No MONGO_URI config");
    throw Error("No MONGO_URI config");
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
      console.info("Connected to database at", uri);
    });

    database.on("error", () => {
      console.error("Error connecting to database");
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
  collection: string;
  limit?: number;
}) => {
  const limit = opt.limit ?? 1000000;

  const col = await collection(opt.collection);

  const data = col.find().limit(limit).toArray();
  if (!data || (await data).length === 0) {
    return;
  }
  return data;
};
