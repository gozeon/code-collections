import * as express from "express";
import * as fs from "fs-extra";
import * as path from "path";
const request: any = require("request");

export class Controller {
  public static getPoints(req: express.Request, res: express.Response, next: express.NextFunction): void {
    fs.readJson(path.resolve(__dirname, "../../data.json"), (err, dataObj) => {
      if (err) {
        next(err);
      }
      res.json(dataObj);
    });
  }

  public static planRoute(req: express.Request, res: express.Response, next: express.NextFunction): void {
    const estimatedTime: number = req.query.time;
    const start: any = req.query.start;
    const end: any = req.query.end;

    const data: any = fs.readJsonSync(path.resolve(__dirname, "../../data.json")).data;
    const sortByPopularity: any = data.sort(function (a: any, b: any) {
      return b.popularity - a.popularity;
    });
    const baseUrl: string = "http://api.map.baidu.com/direction/v1?mode=driving&"
      + `origin=${encodeURIComponent(start)}&destination=${encodeURIComponent(end)}`
      + `&origin_region=${encodeURIComponent("天津")}&destination_region=${encodeURIComponent("天津")}`
      + `&output=json&ak=zKdWlrPP6vb5RXU3rIx8EBGsNKXceAkU`;
    let avgTime = 0;
    let waypoints = "&waypoints=";
    let urlObjs: any = [];
    let points: any = [];

    for (let i = 0; i < sortByPopularity.length; i++) {
      let str: string;
      if (i === 0) {
        str = `${encodeURIComponent(sortByPopularity[i].title)}`;
      } else {
        str = `|${encodeURIComponent(sortByPopularity[i].title)}`;
      }
      if (i >= 4) {
        waypoints = `&waypoints=${encodeURIComponent(sortByPopularity[0].title)}`
          + `|${encodeURIComponent(sortByPopularity[1].title)}`
          + `|${encodeURIComponent(sortByPopularity[2].title)}`
          + `|${encodeURIComponent(sortByPopularity[3].title)}`
          + `|${encodeURIComponent(sortByPopularity[i].title)}`;
        avgTime = Number(sortByPopularity[0].averagePlayTime)
          + Number(sortByPopularity[1].averagePlayTime)
          + Number(sortByPopularity[2].averagePlayTime)
          + Number(sortByPopularity[3].averagePlayTime)
          + Number(sortByPopularity[i].averagePlayTime);
        points[i] = [
          sortByPopularity[0].point,
          sortByPopularity[1].point,
          sortByPopularity[2].point,
          sortByPopularity[3].point,
          sortByPopularity[i].point,
        ];
      } else {
        waypoints += str;
        avgTime += Number(sortByPopularity[i].averagePlayTime);
        if (i === 0) {
          points[i] = [sortByPopularity[0].point];
        }
        if (i === 1) {
          points[i] = [
            sortByPopularity[0].point,
            sortByPopularity[1].point,
          ];
        }
        if (i === 2) {
          points[i] = [
            sortByPopularity[0].point,
            sortByPopularity[1].point,
            sortByPopularity[2].point,
          ];
        }
        if (i === 3) {
          points[i] = [
            sortByPopularity[0].point,
            sortByPopularity[1].point,
            sortByPopularity[2].point,
            sortByPopularity[3].point,
          ];
        }
      }
      urlObjs.push({ url: baseUrl + waypoints, avgTime: avgTime, index: i, points: points[i] });
    }

    let results: any = [];
    for (let i = 0; i < urlObjs.length; i++) {
      request({
        methond: "GET",
        uri: urlObjs[i].url
      }, function (error: any, response: any, body: any) {
        let duration: number = JSON.parse(body).result.routes[0].duration;
        let realTime: number = Math.ceil(duration / 3600);
        results.push({ time: realTime + urlObjs[i].avgTime, points: urlObjs[i].points });

        if (results.length === urlObjs.length) {
          const sortByTime: any = results.sort(function (a: any, b: any) {
            return a.time - b.time;
          });
          for (let i = 0; i < sortByTime.length; i++) {
            if (Number(sortByTime[i].time) > Number(estimatedTime)) {
              res.json({
                waypoints: sortByTime[i - 1].points
              });
              break;
            }
          }

        }
      });
    }
  }
}
