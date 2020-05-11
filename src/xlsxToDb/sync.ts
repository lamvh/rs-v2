import * as xlsx from "xlsx";
import path from "path";

const neighbourhoods = async () => {
  console.info("Starting process neighbourhood xlsx");

  const wb = xlsx.readFile(
    path.join(process.cwd(), "static/neighbourhoods.xlsx")
  );

  const data = await xlsx.utils.sheet_to_json(wb.Sheets.neighbourhoods, {});

  console.info("Processed neighbourhoods xlsx");
  return data;
};

const calendarDetail = async () => {
  console.info("Starting process calendar-detail xlsx");
  const wb = xlsx.readFile(
    path.join(process.cwd(), "static/calendar-detail.xlsx")
  );
  const data = await xlsx.utils.sheet_to_json(wb.Sheets.calendarDetail, {});
  console.log(wb, data);
  console.info("Processed calendar-detail xlsx");
  return data;
};

export const syncMongoDb = async () => {
  // await neighbourhoods();
  // await calendarDetail();
};
