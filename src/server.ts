import { syncMongoDb } from "./syncXLSXToDb/sync";
import { connect } from "./utils/mongo";
import { contentBased } from "./algorithm/contentBased";
import { exportJSON } from "./exportXLSXToJSON/export";

// import "./exportXLSXToJSON/export";
const server = async () => {
  await connect();
  // a();
  // await syncMongoDb();
  // exportJSON()
  await contentBased();
};

server();
