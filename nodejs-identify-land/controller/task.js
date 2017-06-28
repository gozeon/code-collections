const genId = require('gen-id')('nnnnnnnnnc');
const db = require('../db/db.js');
const httpStatus = require('../utils/httpstatus.js');
const fs = require('fs-extra');
const path = require('path');
const objectUtils = require('../utils/objectutils');

createTask = function (req, res, next) {
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

    const file = path.resolve(__dirname, '../tasks/', `${taskId}.json`);

    fs.outputJson(file, task, err => {
      if (err === null) {
        next(err);
      }
      res.status(httpStatus.statusCode.StatusOK);
      res.json({ taskId: taskId });
    });
  }
}

getAllTasks = function (req, res, next) {
  const file = path.resolve(__dirname, '../tasks');
  if (fs.existsSync(file)) {
    fs.readdir(file, (err, list) => {
      if (err) {
        next(err);
      }
      let result = []
      list.map(item => {
        const jsonFile = path.resolve(__dirname, '../tasks', item);
        const data = fs.readJsonSync(jsonFile);
        const obj = {
          taskName: data.taskName,
          taskId: data.taskId,
          createAt: data.createAt
        }
        result.push(obj);
      });

      res.status(httpStatus.statusCode.StatusOK);
      res.json({
        tasks: result
      });
    })
  } else {
    res.status(httpStatus.statusCode.StatusNotFound);
    res.json({
      error: httpStatus.statusText.StatusNotFound,
      code: httpStatus.statusCode.StatusNotFound,
      msg: "task_is_null"
    })
  }
}

getTaskInfo = function (req, res, next) {
  const taskId = Number(req.params.task_id);
  const file = path.resolve(__dirname, '../tasks/', `${taskId}.json`);

  if (fs.existsSync(file)) {
    fs.readJson(file, (err, data) => {
      if(err) {
        next(err);
      }
      res.status(httpStatus.statusCode.StatusOK);
      res.json(data);
    });
  } else {
    res.status(httpStatus.statusCode.StatusNotFound);
    res.json({
      error: httpStatus.statusText.StatusNotFound,
      code: httpStatus.statusCode.StatusNotFound,
      msg: "task_id_not_found"
    });
  }
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

module.exports = { createTask, getTaskConfig, getAllTasks, getTaskInfo }
