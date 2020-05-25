import { syncMongoDb } from "./syncXLSXToDb/sync";
import { connect } from "./utils/mongo";
import { contentBased } from "./algorithm/contentBased";
import { exportJSON } from "./exportXLSXToJSON/export";

// import "./exportXLSXToJSON/export";
const server = async () => {
  await connect();
  // a();
  // await syncMongoDb();
<<<<<<< HEAD
  // exportJSON();
=======
  // exportJSON()
>>>>>>> a0d153c2de0daa33fb1e9c4de2d0c5ee0d0e5823
  await contentBased();
};

server();
