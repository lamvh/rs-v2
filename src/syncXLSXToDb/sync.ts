import { syncNeighborhoodsToMongoDB } from "./neighborhoods";
import {
  syncCalendarDetailToMongoDB,
  syncCalendarDetailToMongoDBV2,
} from "./calendarDetail";
import { syncListingToMongoDBV2 } from "./listings";
import { syncListingDetailToMongoDBV2 } from "./listingsDetail";
import { syncReviewDetailToMongoDBV2 } from "./reviewsDetail";
import { syncReviewToMongoDBV2 } from "./reviews";

export const syncMongoDb = async () => {
  // await syncNeighborhoodsToMongoDB();
  // await syncCalendarDetailToMongoDBV2();
  // await syncListingToMongoDBV2();
  // await syncListingDetailToMongoDBV2();
  // await syncReviewDetailToMongoDBV2();
  // await syncReviewToMongoDBV2();
};
