const genId = require('gen-id')('nnnnnnnnnc');
const uuid = require('uuid');
const db = require('../db/db.js');
const httpStatus = require('../utils/httpstatus.js');
const fs = require('fs-extra');
const path = require('path');
const objectUtils = require('../utils/objectutils');

createTask = function (req, res, next) {
  if (!(req.body).hasOwnProperty('taskName') || !(req.body).hasOwnProperty('taskColumns')) {
    res.status(httpStatus.statusCode.StatusBadRequest);
    res.send({
      error: httpStatus.statusText.StatusBadRequest,
      code: httpStatus.statusCode.StatusBadRequest,
      msg: "task_error_format"
    });
  } else {
    if (objectUtils.isEmpty(req.body)) {
      res.status(httpStatus.statusCode.StatusBadRequest);
      res.json({
        error: httpStatus.statusText.StatusBadRequest,
        code: httpStatus.statusCode.StatusBadRequest,
        msg: "task_is_null"
      });
    } else {
      let task = req.body;
      const taskId = genId.generate().replace(/0/g, '5');
      task.taskId = taskId;
      task.createAt = new Date();

      db.insertOne('task', task, function (err, result) {
        if (result) {
          res.status(httpStatus.statusCode.StatusOK);
          res.json({ taskId: taskId });
        }
        if (err) {
          next(err);
        }
      })
    }
  }
}

getAllTasks = function (req, res, next) {
  db.find('task', {}, function (err, result) {
    if (err) {
      next(err);
    }
    result.map(item => {
      if (item.hasOwnProperty("_id") || item.hasOwnProperty("taskColumns")) {
        delete item._id;
        delete item.taskColumns;
      }
    });
    res.json({ tasks: result })
  });
}

getTaskInfo = function (req, res, next) {
  const taskId = Number(req.params.task_id);

  db.find('land', { taskId: taskId }, function (err, result) {
    if (err) {
      next(err);
    }

    res.status(httpStatus.statusCode.StatusOK);
    res.json({ data: result });
  });
}

getTaskConfig = function (req, res, next) {
  const taskId = req.query['task_id'];
  db.find('task', { taskId: taskId }, function (err, result) {
    if (err) {
      next(err);
    }
    res.status(httpStatus.statusCode.StatusOK);
    res.json({ taskColumns: result[0]['taskColumns'] })
  });
}

getGeojson = function (req, res, next) {
  const taskId = Number(req.query['task_id']);
  const tempFile = path.resolve(__dirname, '../temp');
  const jsonFile = path.resolve(__dirname, '../temp/', `${uuid.v1()}.json`);
  if (!fs.existsSync(tempFile)) {
    fs.mkdirSync(tempFile);
  }
  db.find('land', { taskId: taskId }, function (err, result) {
    if (err) {
      next(err);
    }
    const data = JSON.stringify({ data: result });
    fs.writeFileSync(jsonFile, data);
    res.status(httpStatus.statusCode.StatusOK);
    res.download(jsonFile, `${(new Date()).valueOf()}.json`);
  });
}

module.exports = { createTask, getTaskConfig, getAllTasks, getTaskInfo, getGeojson }
