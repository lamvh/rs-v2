import { syncMongoDb } from "./syncXLSXToDb/sync";
import { connect } from "./utils/mongo";

connect();
syncMongoDb();
