//
// create reviewer
//

import {
  getUsersWithNumberOfReview,
  getReviewersFromReviewDetails,
  getReviewers,
} from "./reviewer/reviewer";
import { collection } from "../utils/mongo";
import { collectionsEnum } from "../types/enum";
import { getReviews, getReviewsFromListings } from "./review/review";
import chalk from "chalk";
import { reviewDetail } from "../types/reviewDetail";
import { reviewer } from "../types/reviewer";
import { listingDetail } from "../types/listingDetail";
import { getListings } from "./listing/listing";
import Bluebird from "bluebird";
import { sample, remove } from "lodash";

const log = console.log;

const LIMIT_LISTING = +process.env.LIMIT_LISTING! || 0;
const LIMIT_USER = +process.env.LIMIT_USER! || 0;
const LIMIT_REVIEW = +process.env.LIMIT_REVIEW! || 0;
const LOOP_COUNT = +process.env.LOOP_COUNT! || 1;
//

export const createReviewerCollection = async () => {
  const reviews = await getReviews();
  const { uniq } = await getReviewersFromReviewDetails();

  const col = await collection(collectionsEnum.reviewers);

  const users = await getUsersWithNumberOfReview({
    reviews,
    reviewers: uniq,
  });

  if (users && users.length > 0) {
    await col.remove({}).then(() => {
      log(`- - - Removed collection: ${col.name}`);
    });

    await col.insertMany(users).then(() => {
      log(chalk.green("Insert many done"));
    });
  }
};

const createFakeReviewData = async ({
  reviewers,
  reviews,
  listings,
}: {
  reviews: reviewDetail[];
  reviewers: reviewer[];
  listings: listingDetail[];
}) => {
  if (reviews?.length === 0) {
    throw new Error("Reviews data is empty for fake");
  }

  if (reviewers?.length === 0) {
    throw new Error("Reviewers data is empty for fake");
  }

  if (listings?.length === 0) {
    throw new Error("Listing data is empty for fake");
  }

  const newReviews: reviewDetail[] = [];

  await Bluebird.each(reviewers, async (user, index) => {
    let count = 0;
    const altListings = listings;
    while (count <= LOOP_COUNT) {
      const listing = sample(altListings);
      const review = sample(reviews);
      if (review && listing) {
        const newReview = {
          ...review,
          alt_reviewer_id: user.id,
          alt_listing_id: listing.id,
        };

        remove(reviews, (e) => e.id === review.id);
        // remove(altListings, (e) => e._id === listing._id);

        newReviews.push(newReview);

        log(
          "=================== ",
          reviews.length,
          "Reviews",
          listings.length,
          "listings"
        );
      }
      ++count;
    }
  });
  return newReviews;
};

const UPDATE_FAKE_DATA = true;

const fake = async () => {
  // Fake reviewer_id and listing_id
  // remove all old fake data
  // update new fake data

  const listings = await getListings(LIMIT_LISTING);
  const reviewers = await getReviewers(LIMIT_USER);
  const reviews = await getReviewsFromListings({
    reviews: await getReviews(LIMIT_REVIEW),
    listings,
  });

  log("--- Found", listings.length, "listings");
  log("--- Found", reviewers.length, "reviewers");
  log("--- Found", reviews.length, "reviews");

  const fakeReviews = await createFakeReviewData({
    reviewers,
    reviews,
    listings,
  });

  log("Found", fakeReviews.length, "review");

  if (UPDATE_FAKE_DATA) {
    const col = await collection(collectionsEnum.reviewDetails);

    await col.updateMany(
      {},
      { $unset: { alt_reviewer_id: "", alt_listing_id: "" } }
    );

    await Bluebird.each(fakeReviews, async (review) => {
      col.findOneAndUpdate(
        { _id: review._id },
        {
          $set: {
            alt_reviewer_id: review.alt_reviewer_id,
            alt_listing_id: review.alt_listing_id,
          },
        },
        { upsert: true }
      );
    });
  }
};

export const runFakeData = async () => {
  await fake();
};
