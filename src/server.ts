import { connect } from "./utils/mongo";
import runRaccoon from "./algorithm/raccoon/raccoon";
import { calSentimentAndUpdateToMongoDB } from "./algorithm/natural/stemAndSentiment";
import { runFakeData } from "./data/fakeData";
import { trainData } from "./algorithm/collaborateFiltering/collaborateFiltering";

const UPDATE_SENTIMENT = process.env.UPDATE_SENTIMENT;
const FAKE_DATA = process.env.FAKE_DATA;
const RUN_RACCOON = process.env.RUN_RACCOON;
const TRAIN_DATA_WITH_CF = process.env.TRAIN_DATA_WITH_CF;

const server = async () => {
  await connect();

  if (UPDATE_SENTIMENT === "true") {
    await calSentimentAndUpdateToMongoDB(10000);
  }

  if (FAKE_DATA === "true") {
    await runFakeData();
    console.log("- Fake data done !");
  }

  if (RUN_RACCOON === "true") {
    await runRaccoon();
  }

  if (TRAIN_DATA_WITH_CF === "true") {
    await trainData();
  }
};

server();
