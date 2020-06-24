import { exportJSON } from "./exportXLSXToJSON/export";

const exportData = async () => {
  await exportJSON();
};

exportData();
