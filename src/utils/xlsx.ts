import * as xlsx from "xlsx";
import path from "path";

export const getRawDataFromXLSX = async (opt: {
  fileName: string;
  sheetName: string;
}) => {
  console.info("Starting process", opt.fileName, "xlsx");

  const wb = xlsx.readFile(
    path.join(process.cwd(), `static/xlsx/amsterdam/${opt.fileName}.xlsx`)
  );
  const data = xlsx.utils.sheet_to_json(wb.Sheets[opt.sheetName]);

  console.info("!!! Processed neighbourhoods xlsx", data.length, "rows");

  return data;
};
