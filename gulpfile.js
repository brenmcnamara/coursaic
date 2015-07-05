var babel = require('gulp-babel');
var browserify = require('browserify');
var del = require('del');
var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('browserify', ['js-transforms'], function () {
    return browserify('dist/public/javascripts/main.js')
      .bundle()
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('dist/public/javascripts/'));
});

gulp.task('clean', function (cb) {
  del([
    'dist/'
  ], cb)
});

gulp.task('default', [
  'less',
  'browserify',
  'clean',
  'js-transforms',
  'move-static-files'
]);

gulp.task('js-transforms', ['clean'], function () {
  return gulp.src(['*.js', '**/*.js', '!bin/www', '!node_modules/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
});

gulp.task('less', ['move-static-files'], function () {
  return gulp.src(['public/stylesheets/*.less'])
    .pipe(less({
      path: [ path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(gulp.dest('dist/public/stylesheets/'));
});

gulp.task('move-static-files', ['clean'], function () {
  return gulp.src([
    "**/*",
    "!*.js",
    "!**/*.js",
    "!**/*.less",
    "!.git",
    "!.gitignore",
    "!gulpfile.js",
    "!package.json"
  ])
    .pipe(gulp.dest('dist'));
});
