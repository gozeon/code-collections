var gulp = require("gulp"),
	newer = require("gulp-newer"),
	imagemin = require("gulp-imagemin"),
	htmlclean = require("gulp-htmlclean"),
	concat = require("gulp-concat"),
	deporder = require("gulp-deporder"),
	stripdebug = require("gulp-strip-debug"),
	uglify = require("gulp-uglify"),
	sass = require("gulp-sass"),
	postcss = require("gulp-postcss"),
	assets = require("postcss-assets"),
	autoprefixer = require("autoprefixer"),
	mqpacker = require("css-mqpacker"),
	cssnano = require("cssnano"),
	devBuild = process.env.NODE_ENV !== "production",
	folder = {
		src: "src/",
		build: "build/"
	};

// image processing
gulp.task("images", function() {
	var out = folder.build + "images/";

	return gulp
		.src(folder.src + "images/**/*")
		.pipe(newer(out))
		.pipe(imagemin({ optimizationLevel: 5 }))
		.pipe(gulp.dest(out));
});

// html processing
gulp.task("html", ["images"], function() {
	var out = folder.build + "html/",
		page = gulp.src(folder.src + "html/**/*").pipe(newer(out));

	if (!devBuild) {
		page = page.pipe(htmlclean());
	}

	return page.pipe(gulp.dest(out));
});

// js processing
gulp.task("js", function() {
	var jsbuild = gulp
		.src(folder.src + "js/**/*")
		.pipe(deporder())
		.pipe(concat("main.js"));

	if (!devBuild) {
		jsbuild = jsbuild.pipe(stripdebug()).pipe(uglify());
	}

	return jsbuild.pipe(gulp.dest(folder.build + "js/"));
});

// CSS processing
gulp.task("css", ["images"], function() {
	var postCssOpts = [
		assets({ loadPaths: ["images/"] }),
		autoprefixer({ browsers: ["last 2 versions", "> 2%"] }),
		mqpacker
	];

	if (!devBuild) {
		postCssOpts.push(cssnano);
	}

	return gulp
		.src(folder.src + "scss/main.scss")
		.pipe(
			sass({
				outputStyle: "nested",
				imagePath: "images/",
				precision: 3,
				errLogToConsole: true
			})
		)
		.pipe(postcss(postCssOpts))
		.pipe(gulp.dest(folder.build + "css/"));
});

// run all tasks
gulp.task("run", ["html", "css", "js"]);

// watch for changes
gulp.task("watch", function() {
	// image changes
	gulp.watch(folder.src + "images/**/*", ["images"]);

	// html changes
	gulp.watch(folder.src + "html/**/*", ["html"]);

	// javascript changes
	gulp.watch(folder.src + "js/**/*", ["js"]);

	// css changes
	gulp.watch(folder.src + "scss/**/*", ["css"]);
});

// default task
gulp.task("default", ["run", "watch"]);
