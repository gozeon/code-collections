const genId = require('gen-id')('nnnnnnnnnc');
const db = require('../db/db.js');
const httpStatus = require('../utils/httpstatus.js');
const sphericalMercator = require('sphericalmercator');
const exec = require('child_process').exec;
const urllib = require('urllib');
const path = require('path');
const fs = require('fs');

createLand = function (req, res, next) {
  let land = req.body;
  const landId = genId.generate().replace(/0/g, '5');
  land.landId = landId;

  db.insertOne('land', land, function (err, result) {
    if (err) {
      next(err);
    }
    if (result) {
      res.status(httpStatus.statusCode.StatusOK);
      res.json({ landId: landId });
    }
  });
}

identifyLand = function (req, res, next) {
  const lon = Number(req.query['lon']);
  const lat = Number(req.query['lat']);
  const zoom = Number(req.query['zoom']);
  const tempFile = path.resolve(__dirname, '../temp');

  if (!fs.existsSync(tempFile)) {
    fs.mkdirSync(tempFile);
  }

  const merc = new sphericalMercator({
    size: 256
  });

  const position = merc.px([lon, lat], zoom);
  const x = position[0];
  const y = position[1];
  const quotientX = Math.floor(x / 256);
  const quotientY = Math.floor(y / 256);
  const remainderX = x % 256;
  const remainderY = y % 256;

  const url = `http://khm0.google.com/kh/v=718&x=${quotientX}&y=${quotientY}&z=${zoom}&s=Gali`;
  urllib.request(url, function (err, data, ress) {
    if (err) {
      next(err);
    }
    if (ress.status == 404) {
      res.status(httpStatus.statusCode.StatusBadRequest);
      res.send(httpStatus.statusText.StatusBadRequest);
    }
    const imgFile = path.resolve(__dirname, '../temp/', `${(new Date()).valueOf()}.png`);
    fs.writeFileSync(imgFile, data);

    const shell = `python ./rg_adapt_thred.py ${remainderX} ${remainderY} ${imgFile}`;
    exec(shell, function (error, stdout, stderr) {
      if (stdout === '') {
        res.status(httpStatus.statusCode.StatusBadRequest);
        res.send(httpStatus.statusText.StatusBadRequest);
      }
      const result = JSON.parse(String(Array.of(stdout)))
      const data = result.map(function (item) {
        let l1 = quotientX * 256 + item[0];
        let l2 = quotientY * 256 + item[1];
        return merc.ll([l1, l2], zoom);
      });
      res.status(200);
      res.json({ data: data });
    });
  });
}

module.exports = { createLand, identifyLand }