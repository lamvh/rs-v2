import { connect } from "./utils/mongo";
import runRaccoon from "./algorithm/raccoon/raccoon";
import { calSentimentAndUpdateToMongoDB } from "./algorithm/natural/stemAndSentiment";
import { runFakeData } from "./data/fakeData";
// import { addTable } from "./algorithm/cf";

const UPDATE_SENTIMENT = false;
const FAKE_DATA = true;
const RUN_RACCOON = true;

//
const server = async () => {
  await connect();

  if (UPDATE_SENTIMENT) {
    await calSentimentAndUpdateToMongoDB(10000);
  }

  if (FAKE_DATA) {
    await runFakeData();
    console.log("- Fake data done !");
  }

  if (RUN_RACCOON) {
    await runRaccoon();
  }

  // addTable();
};

server();
