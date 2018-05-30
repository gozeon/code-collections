var gulp = require('gulp');
var electron = require('electron-connect').server.create();

gulp.task('serve', function () {

  // Start browser process
  electron.start();

  // Restart browser process
  gulp.watch('main.js', electron.restart);

  // Reload renderer process
  gulp.watch(['renderer.js', 'index.html'], electron.reload);
});

gulp.task('haha', function () {
  console.log('haha')
});

gulp.task('clock', function() {
  setInterval(function () {
    const date = new Date();
    const y = date.getFullYear();
    const M = date.getMonth();
    const d = date.getDate();
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();
    console.log(`${y}/${M}/${d} ${h}:${m}:${s}`);
  }, 500);
})

gulp.task('default', ['serve']);
