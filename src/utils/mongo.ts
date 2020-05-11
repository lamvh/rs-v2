import mongoose from "mongoose";

let database: mongoose.Connection;

export const connect = () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("No MONGO_URI config");
    return;
  }

  if (database) {
    return;
  }
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
