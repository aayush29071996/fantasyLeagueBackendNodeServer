'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify');
var wiredep = require('wiredep').stream;
var _ = require('lodash');
var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});


gulp.task('scripts-reload', function() {
    return buildScripts()
        .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
    return buildScripts();
});

var injectOptions = {
    read: false,
    transform: function(filePath) {
        return filePath;
    },
    starttag: '// injector',
    endtag: '// endinjector',
    ignorePath: conf.paths.dist,
    addRootSlash: false
};

var mainInjectFiles = gulp.src(path.join(conf.paths.dist, 'bower_components/*.min.js'), { read: false })

var vendorInjectFiles = gulp.src([
    path.join(conf.paths.src, '/app/vendor/**/*.js')
]);

var appInjectFiles = gulp.src([
    path.join(conf.paths.src, '/app/**/*.js'),
    '!' + path.join(conf.paths.src, '/app/vendor/**/*.js')
]);


function buildScripts() {
    // console.log('Script Injection Started');

    return gulp.src(path.join(conf.paths.src, 'app/**/*.js'))
        .pipe($.inject(mainInjectFiles, injectOptions))
        .pipe($.inject(vendorInjectFiles, injectOptions))
        .pipe($.inject(appInjectFiles, injectOptions))
        //.pipe(uglify())
        .pipe(wiredep(_.extend({}, conf.wiredep)))
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe(minify({
            minify: true,
            collapseWhitespace: true,
            conservativeCollapse: true,
            minifyJS: true,
            minifyCSS: true,
            getKeptComment: function(content, filePath) {
                var m = content.match(/\/\*![\s\S]*?\*\//img);
                return m && m.join('\n') + '\n' || '';
            }
        }))
        //.pipe($.size())
        //.pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/scripts')))
        .pipe(gulp.dest(path.join(conf.paths.dist, '/scripts/')));
};
