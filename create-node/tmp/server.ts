import * as express from "express";

const app = express();
const v1 = express.Router();
const PORT = process.env.PORT || 3000;

v1.get("/", (req, res, next) => {
  res.send("Hello World");
});

app.use("/v1", v1);

app.listen(PORT);
