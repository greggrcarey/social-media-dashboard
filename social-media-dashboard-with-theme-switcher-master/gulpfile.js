//Initilize module
const {src, dest, watch, series} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const presetEnv = require('@babel/preset-env');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

//use dart-sass for @use
//sass.compiler = require('dart-sass');

//Sass task
function scssTask(){
    return src('app/scss/style.scss', {sourcemaps: true})//point to orinal scss file
    .pipe(sass())//compile with 'dart-sass' required above
    .pipe(postcss([autoprefixer(), cssnano()]))//postprocess with autoprefixer for older browsers and minify with cssnano
    .pipe(dest('dist', {sourcemaps: '.'}));// send output to 'dist' folder and put the source map at the root
}

//Javascript Task
function jsTask() {
    return src('app/js/script.js', {sourcemaps: true})//basically the same as above
    .pipe(babel({presets: ['@babel/preset-env']}))
    .pipe(terser())
    .pipe(dest('dist', {sourcemaps: '.'}));
}

// Browsersysnc
function browserSyncServe(cb){
    browsersync.init({
        server: {
            baseDir: '.',
        },
        notify: {
            styles: {
                top: 'auto',
                bottom: '0'
            },
        },
    });
    cb();
}

function browserSyncReload(cb){
    browsersync.reload();
    cb();
}

function watchTask(){
    watch('*.html', browserSyncReload);
    watch(
        ['app/scss/**/*.scss', 'app/**/*.js'],
        series(scssTask, jsTask, browserSyncReload)
    );
}

//default Gulp task
exports.default = series(scssTask, jsTask, browserSyncServe, watchTask);