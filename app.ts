import express from "express";
import cors from "cors";
import path from "path";
// import raccoon from "./src/algorithm/raccoon/raccoon";
import initRedis from "./src/utils/redis";
import { getRecommendForAllUser } from "./src/algorithm/raccoon/utils";
import { getReviewWithFakedData } from "./src/data/review/review";

import raccoon from "./src/algorithm/raccoon/raccoon";

const app = express();
const port = process.env.PORT || 4000;
const baseUrl = `localhost:${port}`;

raccoon();

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

app.get("/data/users", (req, res, next) => {
  return 1;
});

// get recommendation for user
app.post("/data/recommend/userId", (req, res, next) => {
  return null;
});
