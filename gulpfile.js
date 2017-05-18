// npm install --save-dev gulp gulp-if gulp-uglify gulp-beautify gulp-replace gulp-concat minimist
"use strict";

var gulp = require('gulp');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var beautify = require('gulp-beautify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var minimist = require('minimist');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var convert = require('gulp-convert');
var jsonminify = require('gulp-jsonminify');
var browserify = require('gulp-browserify');

var config = require('./gulpconfig.json');

var knownOptions = {
    string: 'env',
    default: {
        env: process.env.NODE_ENV || 'dev'
    }
};



var options = minimist(process.argv.slice(2), knownOptions);
var devMode = options.env;

var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
};

var autoprefixerOptions = {
    browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']
}

// Paths
var paths = {
    scripts: {
        dependencies: {
            input: ['main.js', 'static/components/**/*.js', 'static/modules/**/*.js', '!static/pages/**/*.js'],
            output: {
                dev: 'scripts/js',
                prod: 'dist/scripts/js'
            }
        },
        js: {
            input: 'scripts/js/main.js',
            output: {
                dev: 'scripts/js',
                prod: 'dist/scripts/js'
            }
        }
    },
    styles: {
        input: ['static/**/*.scss'],
        output: {
            dev: 'styles',
            prod: 'dist/styles'
        }
    },
    html: {
        input: '*.html',
        output: {
            dev: '/',
            prod: 'dist' 
        }
    },
    images: {
        input: 'static/global/img/**/*',
        output: {
            dev: 'images',
            prod: 'dist/images'
        }
    },
    xml: {
        input: 'data/xml/**/*.xml',
        output: 'data/json'
    },
    json: {
        input: 'data/json/**/*.json',
        output: 'data/json/min'
    }
}


// Build dependencies
gulp.task('build-dependencies', function () {
    return gulp.src(paths.scripts.dependencies.input)
        .pipe(concat('main.js'))
        .pipe(gulpif(devMode === 'prod', uglify(), beautify()))
        .pipe(gulpif(devMode === 'prod', gulp.dest(paths.scripts.dependencies.output.prod), gulp.dest(paths.scripts.dependencies.output.dev)));
});

// Build JS files
gulp.task('build-js', ['build-dependencies'], function () {
    return gulp.src(paths.scripts.js.input)
        .pipe(browserify({
            insertGlobals: true
        }))
        .pipe(concat('bundle.js'))
        .pipe(gulpif(devMode === 'prod', uglify(), beautify()))
        .pipe(gulpif(devMode === 'prod', gulp.dest(paths.scripts.js.output.prod), gulp.dest(paths.scripts.js.output.dev)));
});


// Build Images
gulp.task('build-images', function () {
    return gulp.src(paths.images.input)
        .pipe(gulpif(devMode === 'prod', cache(imagemin())))
        .pipe(gulpif(devMode === 'prod', gulp.dest(paths.images.output.prod), gulp.dest(paths.images.output.dev)));
});

// Build CSS
gulp.task('build-styles', function () {
    return gulp.src(paths.styles.input)
        .pipe(sourcemaps.init())
        .pipe(gulpif(devMode === 'prod', sass({outputStyle: 'compressed'}), sass(sassOptions).on('error', sass.logError)))
        .pipe(replace('../../global/img/', '../images/'))
        .pipe(sourcemaps.write())
        .pipe(rename({dirname: ''}))
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(gulpif(devMode === 'prod', gulp.dest(paths.styles.output.prod), gulp.dest(paths.styles.output.dev)));
});

// Build HTML
gulp.task('build-html', ['build-js'], function(){
    return gulp.src(paths.html.input)
        .pipe(gulpif(devMode === 'prod', replace('static/global/img/', 'images/')))
        .pipe(gulpif(devMode === 'prod', gulp.dest(paths.html.output.prod)));
});

//
// Watchers
//
gulp.task('watch', function() {
    gulp.watch(paths.styles.input, ['build-styles']).on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});




gulp.task('convert-xml-to-json', function(){
    return gulp.src(paths.xml.input)
        .pipe(convert({
            from: 'xml',
            to: 'json'
        }))
        .pipe(gulp.dest(paths.xml.output))
});

gulp.task('minify-json', function(){
    return gulp.src(paths.json.input)
        .pipe(jsonminify())
        .pipe(gulp.dest(paths.json.output))
});

gulp.task('build', ['build-dependencies', 'build-js', 'build-images', 'build-styles', 'build-html']);
gulp.task('default', ['build']);