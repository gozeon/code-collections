# 现在化的开发工作流程
-  版本控制工具
-  包管理工具
-  自动化任务工具
-  自动化测试工具(browsersync)
-  持续集成工具(Travis ci)
-  脚手架工具

### 自动化任务工具

> 自动化任务工具用来自动化地执行开发过程中需要重复进行的任务。(编译Typescript、压缩Typescript)

#### gulp与grunt的区别
1. Gulp的插件数略少与Grunt
2. 在Grunt中，我们使用文件作为任务的输入和输出，而在Gulp中，我们使用的是流。
3. Grunt插件大多使用键值对来进行配置，Gulp插件则更倾向于使用代码来描述任务，而不是配置，任务可读性高

### 管理Gulp任务的执行顺序

> Gulp默认是异步执行所有任务的

解决方法：
1. 传递一个回调函数
2. 返回一个流
3. 返回一个promise

```javascript
// 传递一个回调函数
gulp.task('sync', function(cd) { // 注意cb参数
    // setTimeout 可以是任意的异步函数
    setTimeout(function() {
      cd(); // cd 在这里执行
    }, 1000);
});

// 返回一个流
gulp.task('sync', function() {
  return gulp.src('js/*.js') // 注意return关键字在此
  .pipe(concat('script.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('../dist/js'))
});

// 现在已经有了一个同步的任务，将其加入任务依赖，来管理执行顺序

gulp.task('secondTask', ['sync'], function() {
  // 这个任务在sync任务完成前都不会执行
})

// 在上述代码里，secondTask任务在sync任务完成前都不会执行。假设现在有第三个名为thirdTask的任务,我们希望
// default任务在sync和thirdTask这两个任务都完成再执行，并且sync和thirdTask这两个任务是并行执行的

gulp.task('default', ['sync', 'thirdTask'], function() {
  // 在这里执行任务
})
```

还可以通过npm安装一个名为run-sequence的gulp的插件，它将使我们能更好地控制任务执行顺序
```javascript
var runSequence = require('run-sequence');
gulp.task('default', function(cd) {
	runSequence(
		'lint',
		['tsc', 'tsc-tests'], // 并行
		['bundle-js', 'bundle-test'], // 并行
		'karma',
		'browser-sync',
		cd  // callback
	);
});
```