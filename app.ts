import express from "express";
import cors from "cors";
import path from "path";
import initRedis from "./src/utils/redis";
import { getRecommendForAllUser } from "./src/algorithm/raccoon/utils";
import { getReviewWithFakedData } from "./src/data/review/review";

import { getReviewers } from "./src/data/reviewer/reviewer";
import {
  getListings,
  getListingById,
  getListingsByIds,
} from "./src/data/listing/listing";
import server from "./src/server";
import { getRecommendForUserByCFAlgorithm } from "./src/algorithm/collaborateFiltering/collaborateFiltering";

const app = express();
const port = process.env.PORT || 4000;
const baseUrl = `localhost:${port}`;

const LIMIT_USER = process.env.LIMIT_USER;
const LIMIT_LISTING = process.env.LIMIT_LISTING;

server();

app.listen(port, () => console.log(`App listening on port ${port}!`));

app.use(cors());

app.get("/data", (req, res, next) => {
  const data = new Date().toISOString();
  console.log(path.join(baseUrl, "data: "), data);
  res.send(data);
});

app.get("/data/users", async (req, res, next) => {
  if (!LIMIT_USER) {
    next("no limit user");
  }

  if (LIMIT_USER) {
    const data = await getReviewers(+LIMIT_USER);
    res.send(data);
    console.log("Request", req.originalUrl, "data", data.length, "users");
  }
});

app.get("/data/listings", async (req, res, next) => {
  if (!LIMIT_LISTING) {
    next("no limit listing config");
  }

  if (LIMIT_LISTING) {
    const data = await getListings(+LIMIT_LISTING);
    res.send(data);
    console.log("Request", req.originalUrl, "data", data.length, "listings");
  }
});

//
// get room by id
//
app.get("/data/listing", async (req, res, next) => {
  const { id } = req.query;
  console.log("param", id);

  if (!id) {
    next();
  }

  const data = await getListingById(+id);
  console.log("Request", req.originalUrl, "data");
  res.send(data);
});

// RECOMMEND PAGE
app.get("/data/best", async (req, res, next) => {
  const rac = await initRedis();
  const roomIds = await rac.bestRated();
  const data = await getListingsByIds(roomIds.slice(0, 8));

  if (!data) {
    next();
  }

  if (data) {
    console.log("Request", req.originalUrl, "data", data.length, "recommends");
    res.send(data);
  }
});

// RACCOON
app.get("/data/raccoon", async (req, res, next) => {
  const { id } = req.query;

  if (!id) {
    next();
  }
  const rac = await initRedis();

  const recommends: any[] = await rac.recommendFor(id.toString(), 10);
  const data = await getListingsByIds(recommends);

  // console.log("Request", req.originalUrl, "data", data.length, " recommends");
  res.send(data);
});

// CF
app.get("/data/cf", async (req, res, next) => {
  const { id } = req.query;

  if (!id) {
    next();
  }

  const recommends = await getRecommendForUserByCFAlgorithm(id.toString());
  const data = await getListingsByIds(
    recommends.map((recommend) => recommend.toString())
  );

  res.send(data);
});
