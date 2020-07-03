import getStem from "./stem";
import { collection } from "../../utils/mongo";
import { collectionsEnum } from "../../types/enum";
import Bluebird from "bluebird";
import { reviewDetail } from "../../types/reviewDetail";
import { getReviews } from "../../data/review/review";
import getSentiments from "./sentiment";

export const getSentimentFromText = async (text: string) => {
  try {
    const stemWord = await getStem(text);
    const sentiment = await getSentiments(stemWord);

    return sentiment;
  } catch (error) {
    throw new Error(`!!! Can not get Sentiment from text: ${text}`);
  }
};

export const calculateSentimentFromEachReview = async (limit: number = 10) => {
  const reviews: reviewDetail[] = await getReviews(limit);

  const length = reviews.length;

  return await Bluebird.map(reviews, async (review, index) => {
    if (!review.comments) {
      return { ...review, stemArray: [], sentiment: -1 };
    }
    const sentiment = await getSentimentFromText(review.comments);

    const stemArray = await getStem(review.comments);

    const calculated = { ...review, stemArray, sentiment };

    console.log("= Calculating sentiment", index + 1, "/", length);

    return calculated;
  });
};

export const updateSentimentToMongoDB = async (
  reviewDetails: reviewDetail[]
) => {
  const reviewDetailCollection = await collection(
    collectionsEnum.reviewDetails
  );

  if (!reviewDetailCollection) {
    throw new Error(
      "!!! Cant not found reviewDetail collection to update sentiment"
    );
  }

  const length = reviewDetails.length;

  await Bluebird.each(reviewDetails, async (review, index) => {
    await reviewDetailCollection.findOneAndReplace({ _id: review._id }, review);
    console.log("- Updating sentiment", index, "/", length);
    return Bluebird.delay(50);
  });
};

export const calSentimentAndUpdateToMongoDB = async (limit: number = 1000) => {
  console.log("Start calculate", limit, "and update sentiment to mongoDB");
  const calculated = await calculateSentimentFromEachReview(limit);

  console.log("Update", calculated, " calculated sentiment");
  await updateSentimentToMongoDB(calculated);
};
