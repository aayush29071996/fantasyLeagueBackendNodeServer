'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var concat = require('gulp-concat');
var $ = require('gulp-load-plugins')();
var series = require('stream-series');
var wiredep = require('wiredep').stream;
var _ = require('lodash');

var browserSync = require('browser-sync');
var series = require('stream-series');

gulp.task('inject-reload', ['inject'], function() {
    browserSync.reload();
});

gulp.task('inject', ['scripts', 'styles'], function() {
    var injectStyles = gulp.src([
        path.join(conf.paths.dist, 'assets/css/materialize.min.css'),
        path.join(conf.paths.dist, 'assets/css/angular-datepicker.css'),
        path.join(conf.paths.dist, 'assets/css/style.css'),
        // path.join(conf.paths.dist, '/assets/css/rtl.css'),
    ], {
        read: false
    });

    var vendorInjectScripts = gulp.src([
        path.join(conf.paths.dist, 'bower_components/angular.js'),
        path.join(conf.paths.dist, 'bower_components/angular-ui-router.js'),
        path.join(conf.paths.dist, 'bower_components/angular-route.js'),
        path.join(conf.paths.dist, 'bower_components/angular-animate.min.js'),
        path.join(conf.paths.dist, 'bower_components/jquery.js'),
        path.join(conf.paths.dist, 'bower_components/moment.js'),
        path.join(conf.paths.dist, '/scripts/vendor/materialize.min.js')
    ], {
        read: false
    });

    var injectScripts = gulp.src([
            path.join(conf.paths.dist, '/scripts/vendor/**/*.js'),
            path.join('!' + conf.paths.dist, '/scripts/vendor/jquery.js'),
            path.join('!' + conf.paths.dist, '/scripts/vendor/jquery.min.js'),
            path.join('!' + conf.paths.dist, '/scripts/vendor/materialize.min.js'),
            path.join('!' + conf.paths.src, '/app/**/*.spec.js'),
            path.join('!' + conf.paths.src, '/app/**/*.mock.js'),
        ], {
            read: false
        })
        // .pipe($.angularFilesort()).on('error', conf.errorHandler('AngularFilesort'));

    var injectOptions = {
        //  transform: function(filePath) {
        //  return  filePath ;
        //},
        ignorePath: [conf.paths.src, conf.paths.dist],
        addRootSlash: false
    };

    var injectScripts1 = gulp.src([
        path.join(conf.paths.dist, 'bower_components/jquery.js'),
        path.join(conf.paths.dist, 'bower_components/angular.js'),
        path.join(conf.paths.dist, 'bower_components/angular-ui-router.js'),
        path.join(conf.paths.dist, 'bower_components/moment.js'),
        path.join(conf.paths.dist, '/scripts/shared/js/materialize.min.js'),
        path.join(conf.paths.dist, '/scripts/shared/js/angular-materialize.min.js'),
        path.join(conf.paths.dist, '/scripts/shared/js/moment.js'),
        path.join(conf.paths.dist, '/scripts/shared/js/angular-base64-upload.js'),
        path.join(conf.paths.dist, '/scripts/shared/js/angular-socialshare.min.js'),
        path.join(conf.paths.dist, '/scripts/shared/js/angular-moment.js'),
        path.join(conf.paths.dist, '/scripts/shared/js/angular-datepicker.js'),
        path.join(conf.paths.dist, 'scripts/app.js'),
        path.join(conf.paths.dist, 'scripts/logger.js'),
        path.join(conf.paths.dist, 'scripts/helpers.js'),
        path.join(conf.paths.dist, 'scripts/shared/common/*.js'),
        path.join(conf.paths.dist, 'scripts/shared/vendor/angular-cookies.min.js'),
        path.join(conf.paths.dist, 'scripts/shared/js/html2canvas.js'),
        path.join(conf.paths.dist, 'scripts/shared/js/dom-to-image.min.js')
    ], {
        read: false
    });


    return gulp.src(path.join(conf.paths.src, '/*.html'))
        .pipe($.inject(series(injectStyles), injectOptions))
        .pipe($.inject(series(injectScripts1), injectOptions))
        .pipe(wiredep(_.extend({}, conf.wiredep)))
        .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});