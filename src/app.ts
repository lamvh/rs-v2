import express from "express";
const app = express();
const port = process.env.PORT || 1000;

app.listen(port, (error) => {
  if (error) {
    return console.error(error);
  }
  return console.log(`Server is listening on ${port}`);
});

export default app;
