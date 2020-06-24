import { syncMongoDb } from "./syncXLSXToDb/sync";

const syncData = async () => {
  await syncMongoDb();
};

syncData();
