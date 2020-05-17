import { syncMongoDb } from "./syncXLSXToDb/sync";
import { connect } from "./utils/mongo";
import a from "./app";

const server = () => {
  a();
  connect();
  syncMongoDb();
};

server();
