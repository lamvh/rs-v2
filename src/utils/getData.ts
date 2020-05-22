import mongoose from "mongoose";
import { connect } from "./mongo";
import { collectionsEnum } from "../types/enum";

export const collection = async (
  collectionName: string
): Promise<mongoose.Collection> => {
  const connection = await connect();
  await connection.dropCollection(collectionName);
  await connection.createCollection(collectionName);
  const collectionConnection = connection.collection(collectionName);
  const data = await connection
    .collection("calendarDetailsV2")
    .find()
    .limit(10)
    .toArray();
  console.log(data);

  if (!collection) {
    console.log("Can not connect to", collectionName, "collectionConnection");
  }
  return collectionConnection;
};

export const getDataByCollection = async (opt: {
  collection: string;
  limit?: number;
}) => {
  console.log("Get data from collection", opt.collection);
  try {
    const collectionConnector = await collection(opt.collection);
    console.log(collectionConnector);
    const data = await collectionConnector
      .find()
      .limit(+opt.collection ?? 100)
      .toArray();

    return data;
  } catch (error) {
    throw error;
  }
};
