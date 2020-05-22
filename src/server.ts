import { syncMongoDb } from "./syncXLSXToDb/sync";
import { connect } from "./utils/mongo";
import a from "./app";

const server = async () => {
  await connect();
  // a();
  // await syncMongoDb();
};

server();
