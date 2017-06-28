import * as express from "express";
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;

import { Controller } from "./controller/iss";

// parse application/json
app.use(bodyParser.json());
app.use(express.static("./public"));

app.all("*", function (req: express.Request, res: express.Response, next: express.NextFunction) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.get("/", function (req: express.Request, res: express.Response, next: express.NextFunction) {
  res.render("index");
});

app.get("/points", Controller.getPoints);
app.get("/route", Controller.planRoute);

app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
  res.status(err.status || 500);
  res.send("Internal Server Error");
});

app.listen(PORT);
