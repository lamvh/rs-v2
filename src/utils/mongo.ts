import mongoose from "mongoose";
import Bluebird, { each } from "bluebird";

let database: mongoose.Connection;

export const connect = (): Promise<mongoose.Connection> => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("No MONGO_URI config");
    throw Error("No MONGO_URI config");
  }

  // if (database) {
  //   throw Error("Do not exist Database");
  // }

  try {
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }

  database = mongoose.connection;

  database.once("open", async () => {
    console.info("Connected to database at", uri);
  });

  database.on("error", () => {
    console.error("Error connecting to database");
  });

  return database;
};

export const disconnect = () => {
  if (!database) {
    return;
  }
  mongoose.disconnect();
};

export const collection = async (collectionName: string) => {
  const connection = await connect();
  await connection.dropCollection(collectionName);

  await connection.createCollection(collectionName);

  const collection = connection.collection(collectionName);

  if (!collection) {
    console.log("Can not connect to", collectionName, "collecion");
  }
  return collection;
};

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
