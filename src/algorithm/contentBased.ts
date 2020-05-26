import { getDataFromJSON } from "../utils/getData";
import { collectionsEnum } from "../types/enum";
import { json } from "express";

// tslint:disable-next-line: no-var-requires
const ContentBasedRecommender = require("content-based-recommender");

const length = 1000;
const minScore = 0.1;
const maxSimilarDocuments = 10;

const trainData = async (data: any[]) => {
  console.log("--- Starting training data ....", data.length + 1);
  const recommender = new ContentBasedRecommender({
    minScore,
    maxSimilarDocuments,
  });

  await recommender.train(data);
  console.log("--- Trained Data", JSON.stringify(recommender, null, 4));

  const similarDocuments = recommender.getSimilarDocuments(data[0].id, 0, 10);

  console.log("--- Example data", data[0]);
  console.log("--- Similar Data", similarDocuments);
  return similarDocuments;
};

export const contentBased = async () => {
  const data: any[] = await (
    await getDataFromJSON(collectionsEnum.reviewDetails)
  ).slice(1, length);

  const processedData: { id: string; content: string }[] = data.map(
    (row: any) => ({
      id: row.id,
      content: row.comments,
    })
  );

  const trained = await trainData(processedData);
};
