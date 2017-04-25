var gulp         = require('gulp'),
	rename       = require('gulp-rename'),
	gulpif       = require("gulp-if"),
	debug        = require("gulp-debug"),
	order        = require("gulp-order"),
	concat       = require('gulp-concat'),
	nano         = require('gulp-cssnano'),
	sass         = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	uglify       = require('gulp-uglify'),
	sourcemaps   = require('gulp-sourcemaps'),
	runSequence  = require('run-sequence'),
	gzip         = require('gulp-gzip');


var DIST = "dist";
var SRC = "src";
var TYPINGS = "typings";
var PROD = false;

var nanoOptions = {
	safe: true,
	discardComments: {
		removeAll: true
	}
};


gulp.task("js", function () {

	var tsc = require("gulp-typescript");
	var filename = "angular-super-gallery.js";

	return gulp.src([
		//TYPINGS + "/**/*.ts",
		SRC + "/**/*.ts",
	])
		.pipe(gulpif(!PROD, sourcemaps.init()))
		.pipe(order([
			"angular-super-gallery.ts",
			"angular-super-gallery-controller.ts",
		], {
			base: SRC
		}))
		.pipe(tsc({
			out: filename,
			target: 'ES5',
			removeComments: true
		}))
		.pipe(concat(filename))
		.pipe(gulpif(!PROD, sourcemaps.write()))
		.pipe(gulp.dest(DIST))
		.pipe(debug())
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest(DIST))
		.pipe(debug())
		.pipe(gzip({append: true}))
		.pipe(gulp.dest(DIST))
		.pipe(debug());


});


gulp.task("css", function () {

	return gulp.src([
		SRC + '/gallery-view.scss'
	])
		.pipe(gulpif(!PROD, sourcemaps.init()))
		.pipe(sass())
		.pipe(gulpif(PROD, nano(nanoOptions)))
		.pipe(concat("angular-super-gallery.css"))
		.pipe(autoprefixer())
		.pipe(gulpif(!PROD, sourcemaps.write()))
		.pipe(gulp.dest(DIST))
		.pipe(debug());
});


gulp.task("views", function () {

	var templateCache = require('gulp-angular-templatecache');
	var htmlmin = require('gulp-htmlmin');

	return gulp.src([SRC + '/*.html'])
		.pipe(htmlmin({
			removeComments: false,
			collapseWhitespace: false,
			preserveLineBreaks: false
		}))
		.pipe(templateCache({
			module: 'angularSuperGallery',
			root: 'views/'
		}))
		.pipe(concat("angular-super-gallery-views.js"))
		.pipe(gulp.dest(DIST))
		.pipe(debug());

});


gulp.task("watch", function () {

	var watch = require("gulp-watch");
	var batch = require("gulp-batch");

	watch(SRC + "/*.ts", batch(function (events, done) {
		gulp.start("js", done);
	}));

	watch(SRC + "/*.scss", batch(function (events, done) {
		gulp.start("css", done);
	}));

	watch(SRC + "/*.html", batch(function (events, done) {
		gulp.start("views", done);
	}));

});


gulp.task('bump', function () {

	var bump = require('gulp-bump');

	return gulp.src(['./package.json'])
		.pipe(bump({type: 'patch', indent: 4}))
		.pipe(gulp.dest('./'))
});


gulp.task('version', function (callback) {

	var package = require('./package.json');
	var replace = require('gulp-replace');

	return gulp.src([
		SRC + '/angular-super-gallery.ts',
	])
		.pipe(replace(/version",\s"\d+\.\d+\.\d+/g, 'version ", "' + package.version))
		.pipe(gulp.dest(SRC))
		.pipe(debug())

});

gulp.task('dev', function (callback) {

	prod = false;

	runSequence(
		["js"],
		["css", "views"],
		["version"],
		callback
	)
});

gulp.task('prod', function (callback) {

	prod = true;

	runSequence(
		["bump"],
		["js"],
		["css", "views"],
		["version"],
		callback
	)
});


