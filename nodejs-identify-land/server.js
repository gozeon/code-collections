const path = require('path');
const fs = require('fs-extra');
const express = require('express');
const bodyParser = require('body-parser');
const timeout = require('connect-timeout');
const PORT = process.env.PORT || 3000;

const task = require('./controller/task.js');
const taskV1 = require('./controller/taskv1.js');
const land = require('./controller/land.js');
const download = require('./controller/download.js');
const httpStatus = require('./utils/httpstatus.js');


const app = express();
const v1 = express.Router();
const v2 = express.Router();

// parse application/json
app.use(bodyParser.json());
app.use(timeout('30s'));
app.use(haltOnTimedout);
function haltOnTimedout (req, res, next) {
  if (!req.timedout) next()
}

app.use(express.static('../mapdrawUtil/dist/'));

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/docs', function (req, res, next) {
  fs.readFile(path.join(__dirname + '/docs/index.html'), function(err, page) {
    if(err){
      next(err);
    }
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(page);
    res.end();
  });
});

app.use(function (err, req, res, next) {
  res.status(err.status || httpStatus.statusCode.StatusInternalServerError);
  res.send(httpStatus.statusText.StatusInternalServerError);
});

v1.post('/task', taskV1.createTask);
v1.get('/task/:task_id', taskV1.getTaskInfo);
v1.get('/tasks', taskV1.getAllTasks);
v1.get('/identify_land', timeout('10s'), land.identifyLand);
v1.get('/task_columns', taskV1.getTaskConfig);
v1.post('/land', land.createLand);
v1.get('/geojson', taskV1.getGeojson);

v2.post('/task', task.createTask);
v2.get('/task/:task_id', task.getTaskInfo);
v2.get('/tasks', task.getAllTasks);
v2.get('/identify_land', land.identifyLand);
v2.get('/geojson', download.getGeojson);

app.use('/v1', v1);
app.use('/v2', v2);

app.listen(PORT);
console.log("Running at Port 3000");
