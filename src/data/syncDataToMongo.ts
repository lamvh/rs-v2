import { syncMongoDb } from "./syncToDB/sync";

const syncData = async () => {
  await syncMongoDb();
};

syncData();
