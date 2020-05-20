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
