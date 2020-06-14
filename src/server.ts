import { connect } from "./utils/mongo";
import runRaccoon from "./algorithm/raccoon";
import { calSentimentAndUpdateToMongoDB } from "./natural/stemAndSentiment";

const UPDATE_SENTIMENT = false;
const RUN_RACCOON = true;

const server = async () => {
  await connect();

  if (UPDATE_SENTIMENT) {
    await calSentimentAndUpdateToMongoDB(3000);
  }

  if (RUN_RACCOON) {
    await runRaccoon();
  }
};

server();
