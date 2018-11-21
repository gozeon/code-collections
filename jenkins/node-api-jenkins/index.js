const TOKEN = '110fdd09bd9deb233204e1a58b7e164068'
var jenkins = require('jenkins')({ baseUrl: `http://admin:${TOKEN}@127.0.0.1:8080`, crumbIssuer: true });
var fixtures = require('fixturefiles');

/**********************************************************************************/

// jenkins.info(function(err, data) {
//   if (err) throw err;

//   console.log('info', data);
// });

/**********************************************************************************/

// jenkins.build.get('example', 1, function(err, data) {
//   if (err) throw err;

//   console.log('build', data);
// });

/**********************************************************************************/

// jenkins.build.log('example', 1, function(err, data) {
//   if (err) throw err;

//   console.log('log', data);
// });

/**********************************************************************************/

// var log = jenkins.build.logStream('example', 23);

// log.on('data', function(text) {
//   process.stdout.write(text);
// });

// log.on('error', function(err) {
//   console.log('error', err);
// });

// log.on('end', function() {
//   console.log('end');
// });

/**********************************************************************************/

// jenkins.build.stop('example', 24, function(err) {
//   if (err) throw err;
// });

/**********************************************************************************/

// jenkins.job.build('example', function(err, data) {
//   if (err) throw err;

//   console.log('queue item number', data);
// });

/**********************************************************************************/

// jenkins.job.config('example', function (err, data) {
//   if (err) throw err;

//   console.log('xml', data);
// });

/**********************************************************************************/

// jenkins.job.create('example1', fixtures.pipeline, function (err) {
//   if (err) throw err;
// });

/**********************************************************************************/


// jenkins.job.build('example1', function (err, data) {
//   if (err) throw err;

//   console.log('queue item number', data);

//   jenkins.job.get('example1', function (err, data) {
//     if (err) throw err;

//     console.log('job', data);
//     console.log(data.lastBuild);

//     var log = jenkins.build.logStream('example1', data.lastBuild.number);

//     log.on('data', function (text) {
//       process.stdout.write(text);
//     });

//     log.on('error', function (err) {
//       console.log('error', err);
//     });

//     log.on('end', function () {
//       console.log('end');
//     });
//   });
// });

jenkins.job.get('example1', function (err, data) {
  if (err) throw err;

  console.log('job', data);
  console.log(data.lastBuild);

  var log = jenkins.build.logStream('example1', data.lastBuild.number);

  log.on('data', function (text) {
    process.stdout.write(text);
  });

  log.on('error', function (err) {
    console.log('error', err);
  });

  log.on('end', function () {
    console.log('end');
  });
});


