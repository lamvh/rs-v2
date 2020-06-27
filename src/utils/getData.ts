import fs from "fs";
import path from "path";

// export const getDataByCollection = async (opt: {
//   collection: string;
//   limit?: number;
// }) => {
//   console.log("Get data from collection", opt.collection);
//   try {
//     const data = await (await collection(opt.collection)).find().toArray();

//     if (!data) {
//       console.log("!!! getDataByCollection: NO DATA");
//       return;
//     }

//     console.log("found ", data.length, "document");
//     console.log("example", data[0]);

//     return data;
//   } catch (error) {
//     console.log("!!!!!! getDataByCollection", error);
//   }
// };

export const getDataFromJSON = async (fileName: string): Promise<any[]> => {
  const dir = path.join(
    process.cwd(),
    process.env.JSON_OUTPUT_DIR!,
    `${fileName}.json`
  );
  console.log("--- Reading data from JSON file", dir);

  const rawData = fs.readFileSync(dir, "utf8");

  if (!rawData) {
    console.log("!!! Empty data from JSON file", dir);
    return [];
  }
  const data = JSON.parse(rawData);

  console.log("--- Get data from", fileName, "data length:", data.length);

  return data;
};
