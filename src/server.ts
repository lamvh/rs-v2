import { syncMongoDb } from "./syncXLSXToDb/sync";
import { connect } from "./utils/mongo";
import { contentBased } from "./algorithm/contentBased";
import "./exportXLSXToJSON/export";
const server = async () => {
  await connect();
  // a();
  // await syncMongoDb();
  // await contentBased();
};

server();
