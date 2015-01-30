var watch = require('gulp-watch');
var shell = require('gulp-shell');
var gulp = require('gulp');

gulp.task('jest', shell.task([
  'jest'
]));

gulp.task('jest-watch', ['jest'], function () {
  watch(['src/**/*.js'], function () {
    gulp.task('jest');
  });
});
