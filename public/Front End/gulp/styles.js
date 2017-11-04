'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var cleanStyles = require('gulp-clean-css');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

gulp.task('styles-reload', ['styles'], function() {
  return buildStyles()
    .pipe(browserSync.stream());
});

gulp.task('styles', function() {
  return buildStyles();
});

var buildStyles = function() {
  var sassOptions = {
    style: 'expanded'
  };

  var injectFiles = gulp.src([
    path.join(conf.paths.src, '/assets/css/**/*.css')
  ], { read: false });

  var injectOptions = {
    ignorePath: conf.paths.dist,
    starttag: '// injector',
    endtag: '// endinjector',
    addRootSlash: false
  };

  // console.log('Styles Injection Started');
  return gulp.src([
    path.join(conf.paths.src, '/assets/css/**/*.css')
  ])
    .pipe($.inject(injectFiles, injectOptions))
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    //.pipe(cleanStyles({compatibility: 'ie8'}))
    //.pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/assets/css')))
    .pipe(gulp.dest(path.join(conf.paths.dist, '/assets/css')));
};
