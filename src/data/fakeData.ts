//
// create regular reviewer only (more than 2 reviews)
//

import {
  getNumberOfReviewByUsers,
  getReviewersFromReviewDetails,
} from "./reviewer/reviewer";
import { collection } from "../utils/mongo";
import { collectionsEnum } from "../types/enum";
import { getReviewDetailData } from "./review/review";

const log = console.log;

const createReviewerCollection = async () => {
  // get data
  const reviews = await getReviewDetailData();
  const { regular } = await getReviewersFromReviewDetails();

  // save to db
  const col = await collection(collectionsEnum.reviewers);

  await col.remove({}).then(() => {
    log(`- - - Removed collection: ${col.name}`);
  });

  const regularUsers = await getNumberOfReviewByUsers({
    reviews,
    users: regular,
  });

  await col.insertMany(regularUsers);
};

// createReviewerCollection();
