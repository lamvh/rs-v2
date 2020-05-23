import mongoose from "mongoose";
import { connect, collection } from "./mongo";
import { collectionsEnum } from "../types/enum";

export const getDataByCollection = async (opt: {
  collection: string;
  limit?: number;
}) => {
  console.log("Get data from collection", opt.collection);
  try {
    const collectionConnector = await collection(opt.collection);
    const data = await collectionConnector
      .find()
      .limit(+opt.collection ?? 100)
      .toArray();

    return data;
  } catch (error) {
    throw error;
  }
};
