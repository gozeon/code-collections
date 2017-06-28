const uuid = require('uuid');
const db = require('../db/db.js');
const path = require('path');
const fs = require('fs-extra');
const httpStatus = require('../utils/httpstatus.js');

getGeojson = function (req, res, next) {
  const taskId = Number(req.query['task_id']);
  const file = path.resolve(__dirname, '../tasks/', `${taskId}.json`);

  if (fs.existsSync(file)) {
    res.status(httpStatus.statusCode.StatusOK);
    res.download(file);
  } else {
    res.status(httpStatus.statusCode.StatusNotFound);
    res.json({
      error: httpStatus.statusText.StatusNotFound,
      code: httpStatus.statusCode.StatusNotFound,
      msg: "task_id_not_found"
    });
  }
}

module.exports = { getGeojson }