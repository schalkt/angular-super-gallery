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
	gzip         = require('gulp-gzip'),
	tslint       = require('gulp-tslint'),
	gutil        = require('gulp-util');


var DIST = "dist";
var SRC = "src";
var TEMP = "temp";
var PROD = false;

var nanoOptions = {
	safe: true,
	discardComments: {
		removeAll: true
	}
};

var banner = ['/**',
	' * <%= pkg.name %> - <%= pkg.description %>',
	' * ',
	' * @version v<%= pkg.version %>',
	' * @link <%= pkg.homepage %>',
	' * @license <%= pkg.license %>',
	' */',
	''].join('\n');

gulp.task("tslint", function () {

	return gulp.src([
		SRC + "/**/*.ts",
	])
		.pipe(tslint({
			formatter: "prose"
		}))
		.pipe(tslint.report({
			summarizeFailureOutput: true
		}));

});

gulp.task("ts", function () {

	var tsc = require("gulp-typescript");
	var filename = "angular-super-gallery.js";

	return gulp.src([
		SRC + "/**/*.ts",
	])
		.pipe(gulpif(!PROD, sourcemaps.init()))
		.pipe(order([
			"asg.ts",
			"asg-factory.ts"
		], {
			base: SRC
		}))
		.pipe(tsc({
			target: 'ES5',
			removeComments: true
		}))
		.pipe(concat(filename))
		.pipe(gulpif(!PROD, sourcemaps.write()))
		.pipe(gulp.dest(TEMP))
		.pipe(debug());

});

gulp.task("js", ['ts', 'views'], function () {

	var filename = "angular-super-gallery.js";
	var header = require('gulp-header');
	var package = require('./package.json');

	return gulp.src([
		TEMP + "/*.js"
	])
		.pipe(order([
			"angular-super-gallery.js"
		], {
			base: TEMP
		}))
		.pipe(concat(filename))
		.pipe(header(banner, {pkg: package}))
		.pipe(gulp.dest(DIST))
		.pipe(debug());

});


gulp.task("js-min", function () {

	var filename = "angular-super-gallery.js";
	var header = require('gulp-header');
	var package = require('./package.json');

	return gulp.src([
		DIST + "/" + filename,
	])
		.pipe(concat(filename))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify().on('error', function (err) {
			gutil.log(gutil.colors.red('[Error]'), err.toString());
			this.emit('end');
		}))
		.pipe(header(banner, {pkg: package}))
		.pipe(gulp.dest(DIST))
		.pipe(debug())
		.pipe(gzip({append: true}))
		.pipe(gulp.dest(DIST))
		.pipe(debug());

});


gulp.task("css", function () {

	return gulp.src([
		SRC + '/*.scss'
	])
		.pipe(concat("angular-super-gallery.css"))
		.pipe(gulpif(!PROD, sourcemaps.init()))
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(gulpif(!PROD, sourcemaps.write()))
		.pipe(gulp.dest(DIST));

});

gulp.task("css-min", function () {

	var filename = "angular-super-gallery.css";

	return gulp.src([
		DIST + "/" + filename
	])
		.pipe(concat(filename))
		.pipe(nano(nanoOptions))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(DIST))
		.pipe(debug())
		.pipe(gzip({append: true}))
		.pipe(gulp.dest(DIST))
		.pipe(debug());


});


gulp.task("views", function () {

	var templateCache = require('gulp-angular-templatecache');
	var htmlmin = require('gulp-htmlmin');

	return gulp.src([SRC + '/**/*.html'])
		.pipe(htmlmin({
			removeComments: false,
			collapseWhitespace: false,
			preserveLineBreaks: false
		}))
		.pipe(templateCache({
			module: 'angularSuperGallery',
			root: ''
		}))
		.pipe(concat("angular-super-gallery-views.js"))
		.pipe(gulp.dest(TEMP))
		.pipe(debug());

});


gulp.task("watch", function () {

	var watch = require("gulp-watch");
	var batch = require("gulp-batch");

	watch(SRC + "/**/*.html", batch(function (events, done) {
		gulp.start("js", done);
	}));

	watch(SRC + "/*.ts", batch(function (events, done) {
		gulp.start("js", done);
	}));

	watch(SRC + "/**/*.scss", batch(function (events, done) {
		gulp.start("css", done);
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
		["css", "js"],
		["version"],
		callback
	)
});

gulp.task('prod', function (callback) {

	prod = true;

	runSequence(
		["bump"],
		["css", "js"],
		["css-min", "js-min"],
		["version"],
		callback
	)
});


