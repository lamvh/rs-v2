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

app.get("/data/raccoon", (req, res, next) => {
  getReviewWithFakedData().then((reviews) => {
    initRedis().then((redisRaccoon) =>
      getRecommendForAllUser(redisRaccoon, reviews).then((data) => {
        console.log(path.join(baseUrl, "data/raccoon : "), data);
        res.send(data);
      })
    );
  });
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

app.get("/data/recommend", async (req, res, next) => {
  const { id } = req.query;
  console.log("id", id);

  if (!id) {
    next();
  }
  const rac = await initRedis();

  const data = await rac.recommendFor(id.toString(), 50);

  console.log("Request", req.originalUrl, "data");
  res.send(data);
});

app.get("/data/recommend/user", async (req, res, next) => {
  const { id } = req.query;
  console.log(id);
  const rac = await initRedis();
  const data = await rac.recommendFor(id.toString(), 25);

  if (!data) {
    next();
  }

  if (data) {
    console.log("Request", req.originalUrl, "data", data);
    res.send(data);
  }
});

app.get("/data/best", async (req, res, next) => {
  const rac = await initRedis();
  const roomIds = await rac.bestRated();
  const data = await getListingsByIds(roomIds);

  if (!data) {
    next();
  }

  if (data) {
    console.log("Request", req.originalUrl, "data", data);
    res.send(data);
  }
});
