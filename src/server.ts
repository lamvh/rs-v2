import { syncMongoDb } from "./syncXLSXToDb/sync";
import { connect } from "./utils/mongo";
import { contentBased } from "./algorithm/contentBased";

const server = async () => {
  await connect();
  syncMongoDb();
  await contentBased();
};

server();
