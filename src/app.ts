import express from "express";

const app = express();
const port = process.env.PORT || 1000;

const a = app.listen(port, (error: any) => {
  if (error) {
    return console.error(error);
  }
  return console.log(`Server is listening on ${port}`);
});

export default a;
