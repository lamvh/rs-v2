import { collectionsEnum } from "../../types/enum";
import { getRawDataFromXLSX } from "../../utils/xlsx";
import path from "path";
import fs from "fs";

const log = console.log;
const fileName = collectionsEnum.reviewDetails;

export const exportJSONReview = async () => {
  const data = await getRawDataFromXLSX({ fileName, sheetName: fileName });
  const dir = path.join(
    process.cwd(),
    process.env.JSON_OUTPUT_DIR!,
    `${fileName}.json`
  );

  log(dir);

  if (data && data.length > 0) {
    fs.writeFileSync(dir, JSON.stringify(data));
    log("Exported json", fileName);
  } else {
    log("Empty Data");
  }
};
