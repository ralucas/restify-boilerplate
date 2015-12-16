'use strict';

var gulp = require('gulp');
var mocha = require('gulp-mocha');

var yargs = require('yargs').argv;

gulp.task('mocha', function() {
  return gulp.src(['./test/**/**/*.spec.js'], {read: false})
    .pipe(mocha({
      reporter: 'spec',
      grep: yargs.grep || '' 
    }))
    .once('error', console.error.bind(console));
});

gulp.task('test', ['mocha'], function() {
  gulp.watch(['./test/**/**/*.spec.js'], ['mocha']);
});

