import { connect } from "./utils/mongo";
import runRaccoon from "./algorithm/raccoon/raccoon";
import { calSentimentAndUpdateToMongoDB } from "./algorithm/natural/stemAndSentiment";

const UPDATE_SENTIMENT = false;
const RUN_RACCOON = false;

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
