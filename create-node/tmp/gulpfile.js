var gulp = require('gulp');
var ts = require('gulp-typescript');
var tslint = require("gulp-tslint");
var spawn = require('child_process').spawn;
var runSequence = require('gulp-Sequence');
var node;

gulp.task('tsc', function () {
  return gulp.src('./src/**/**.ts').pipe(ts({
    removeComments: true,
    noImplicitAny: true,
    target: 'ES2015',
    module: 'commonjs',
    declarationFiles: false,
  })).js.pipe(gulp.dest('./dist'));
})

gulp.task('lint', function () {
  gulp.src('./src/**/**.ts').pipe(tslint({
    configuration: './tslint.json'
  })).pipe(tslint.report({
    emitError: false, // 报错之后 不终止gulp
  }))
})

gulp.task('server', function () {
  if (node) node.kill();
  node = spawn('node', ['dist/server.js'], {stdio: 'inherit'});
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes');
    }
  })
})

gulp.watch('./src/**/**.ts', ['prod']).on('change', function (event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});

gulp.task('prod', function (cb) {
  runSequence('lint', 'tsc', 'server')(cb);
});

gulp.task('default', ['prod']);

// clean up if an error goes unhandled.
process.on('exit', function() {
  if (node) node.kill()
});
