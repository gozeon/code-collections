var gulp = require('gulp');
var ts = require('gulp-typescript');
var tslint = require("gulp-tslint");

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

gulp.watch('./src/**/**.ts', ['tsc', 'lint']).on('change', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});

gulp.task('default', ['lint', 'tsc']);