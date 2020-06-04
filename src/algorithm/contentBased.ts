import { getDataFromJSON } from "../utils/getData";
import { collectionsEnum } from "../types/enum";
import path from "path";
import fs from "fs";
import lodash from "lodash";

// tslint:disable-next-line: no-var-requires
const ContentBasedRecommender = require("content-based-recommender");

const length = 10000;
const minScore = 0.1;
const maxSimilarDocuments = 20;

const OVERWRITE_TRAINED_DATA = process.env.OVERWRITE_TRAINED_DATA;

const trainData = async (data: any[], fileName: string) => {
  console.log("--- Starting training data ....", data.length + 1);

  let similarDocuments;
  const recommender = new ContentBasedRecommender({
    minScore,
    maxSimilarDocuments,
  });
  const rawDataToGetSimilar = data[20];
  const exportDir = path.join(
    process.cwd(),
    process.env.JSON_OUTPUT_TRAINED_DIR!,
    `${fileName}.json`
  );

  if (OVERWRITE_TRAINED_DATA === "true") {
    console.log("--- Retrain Data .....");
    await recommender.train(data);

    const exportData = await recommender.export();

    if (exportData) {
      fs.writeFileSync(exportDir, JSON.stringify(exportData));
      console.log("--- Exported json", fileName);
    }

    similarDocuments = await recommender.getSimilarDocuments(
      rawDataToGetSimilar.id,
      0,
      10
    );
  } else {
    console.log("--- Reading trained data from ", fileName);
    const rawData = fs.readFileSync(exportDir, "utf8");
    if (!rawData) {
      console.log("!!! EMPTY DATA from", exportDir);
    }
    const trainedData = JSON.parse(rawData);

    recommender.import(trainedData);
    similarDocuments = recommender.getSimilarDocuments(
      rawDataToGetSimilar.id,
      0,
      10
    );
  }

  console.log("--- Example data", data[0]);
  // console.log("--- Similar Data", similarDocuments);
  return similarDocuments;
};

export const contentBased = async () => {
  const data: any[] = (
    await getDataFromJSON(collectionsEnum.reviewDetails)
  ).slice(1, length);

  const processedData: { id: string; content: string }[] = data.map(
    (row: any) => ({
      id: row.id,
      content: row.comments,
    })
  );

  const similarDocuments = await trainData(
    processedData,
    collectionsEnum.reviewDetails
  );

  const mappedData = similarDocuments.map(
    (document: { id: string; content: string }) => {
      const rawData = lodash.filter(data, { id: document.id })[0];
      return {
        id: document.id,
        // data: {
        //   reviewerName: 69.reviewer_name,
        //   comments: rawData.comments,
        // },
        reviewerName: rawData.reviewer_name,
        comments: rawData.comments,
      };
    }
  );

  console.log("-------------------------------------------", mappedData);
};
