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

const createReviewerCollection = async () => {
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
// createReviewerCollection();

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
    while (count <= 20) {
      const listing = sample(listings);
      const review = sample(reviews);
      if (review && listing) {
        const newReview = {
          ...review,
          alt_reviewer_id: user.id,
          alt_listing_id: listing.id,
        };

        remove(reviews, (e) => e.id === review.id);

        newReviews.push(newReview);

        log(
          "---",
          index,
          "/",
          reviewers.length,
          " generated new review id",
          review.id,
          "for user",
          user.id,
          "listing_id",
          review.listing_id
        );

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

const LIMIT_LISTING = 1500;
const LIMIT_USER = 500;
const LIMIT_REVIEW = 10000; // not effect but more performance

const UPDATE_FAKE_DATA = false;

const fake = async () => {
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

  // if (fakeReviews?.length === 0) {
  //   throw new Error("Fake data is empty ");
  // }

  log("Found", fakeReviews.length, "review");

  if (UPDATE_FAKE_DATA) {
    const col = await collection(collectionsEnum.reviewDetails);

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

  // Todo: only 6462 review update to db with alt_reviewer_id
};

fake();
