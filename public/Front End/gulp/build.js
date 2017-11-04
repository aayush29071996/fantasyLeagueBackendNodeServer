'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync');
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('partials', function() {
    return gulp.src([
            path.join(conf.paths.src, '/app/**/*.html')
        ])
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe($.angularTemplatecache('templateCacheHtml.js', {
            module: 'fandom',
            root: 'app'
        }))
        .pipe(gulp.dest(conf.paths.dist + '/scripts/'));
});

gulp.task('html-reload', ['partials'], function() {
    browserSync.reload();
});


gulp.task('html', ['inject', 'partials'], function() {
    var partialsInjectFile = gulp.src(path.join(conf.paths.dist, '/scripts/templateCacheHtml.js'), { read: false });
    var partialsInjectOptions = {
        starttag: '<!-- inject:partials -->',
        ignorePath: conf.paths.dist,
        addRootSlash: false
    };

    var htmlFilter = $.filter('*.html', { restore: true });
    var jsFilter = $.filter('**/**/*.js', { restore: true });
    var cssFilter = $.filter('**/**/*.css', { restore: true });
    var assets;

    return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
        .pipe($.inject(partialsInjectFile, partialsInjectOptions))
        .pipe(htmlFilter)
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true,
            conditionals: true
        }))
        .pipe(htmlFilter.restore)
        .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
        .pipe($.size({ title: path.join(conf.paths.dist, '/'), showFiles: true }));
});

// Only applies for fonts from bower dependencies
// Custom fonts are handled by the "other" task
gulp.task('fonts', function() {
    return gulp.src($.mainBowerFiles())
        .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
        .pipe($.flatten())
        .pipe(gulp.dest(path.join(conf.paths.dist, '/fonts/')));
});

// json files copy
gulp.task('json', function() {
    return gulp.src($.mainBowerFiles())
        .pipe($.filter('**/*.json'))
        .pipe($.flatten())
        .pipe(gulp.dest(path.join(conf.paths.dist, '/db/')));
});

gulp.task('bower', function() {
    gulp.src(path.join(conf.paths.dist, '/bower_components/jquery/jquery.js'))
    gulp.src(path.join(conf.paths.dist, '/bower_components/angular/angular.min.js'))
    gulp.src(path.join(conf.paths.dist, '/bower_components/jquery-ui/jquery-ui.js'))
        .pipe(gulp.dest(path.join(conf.paths.dist, '/bower_components/')));
    return gulp.src($.mainBowerFiles())
        .pipe($.filter('**/*.{js,min.js}'))
        .pipe(uglify())
        .pipe(gulp.dest(path.join(conf.paths.dist, '/bower_components/')));
});


gulp.task('other', function() {
    var fileFilter = $.filter(function(file) {
        return file.stat.isFile();
    });

    return gulp.src([
            path.join(conf.paths.src, '/**/*'),
            path.join('!' + conf.paths.src, '/**/*.{html,scss,css,js}')
        ])
        .pipe(fileFilter)
        .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
});


gulp.task('clean', function() {
    return $.del([path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/')]);
});


gulp.task('build', ['bower', 'html', 'other', 'json']); //'fonts',

gulp.task('war', ['build'], function() {
    gulp.src([
            path.join(conf.paths.dist, '/**/*'),
            '!' + path.join(conf.paths.dist, '/*.war')
        ])
        .pipe($.war({
            welcome: 'index.html',
            displayName: 'fandom',
            version: '1.0',
            webappExtras: [
                '<module>',
                '<web>' +
                '<web-uri>fandom.war</web-uri>' +
                '<context-root>/fandom</context-root>' +
                '</web>' +
                '</module>'
            ]
        }))
        .pipe($.zip('fantumn.war'))
        .pipe(gulp.dest("./dist"));
});