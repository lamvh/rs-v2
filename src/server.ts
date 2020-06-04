import { connect } from "./utils/mongo";
import { contentBased } from "./algorithm/contentBased";

const server = async () => {
  await connect();
  await contentBased();
};

server();
