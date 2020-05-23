import * as xlsx from "xlsx";
import path from "path";
import fs from "fs";

export const getRawDataFromXLSX = async (opt: {
  fileName: string;
  sheetName: string;
}) => {
  console.info("Starting process", opt.fileName, "xlsx");

  const fileDir = path.join(
    process.cwd(),
    `static/xlsx/amsterdam/${opt.fileName}.xlsx`
  );
  console.log("Getting data from", fileDir);
  try {
    if (!fs.existsSync(fileDir)) {
      console.log("Not found file", fileDir);
      return;
    }

    const wb = xlsx.readFile(fileDir);
    const data = xlsx.utils.sheet_to_json(wb.Sheets[opt.sheetName]);

    console.info("!!! Processed", opt.fileName, "xlsx", data.length, "rows");

    return data;
  } catch (error) {
    console.log(error);
  }
};
