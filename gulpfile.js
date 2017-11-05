/**
 * Created by niu on 2017/11/1.
 */
const gulp = require('gulp');
const del = require('del');
const path = require('path');
const autoprefixer = require('gulp-autoprefixer');
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass');
const gutil = require('gulp-util');
const replace = require('gulp-replace');
const combiner = require('stream-combiner2');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");
const cleancss = require('gulp-clean-css');
const runSequence = require('run-sequence');
const imagemin = require("gulp-imagemin");

var colors = gutil.colors;
const handleError = function (err) {
  console.log('\n');
  gutil.log(colors.red('Error!'));
  gutil.log('fileName: ' + colors.red(err.fileName));
  gutil.log('lineNumber: ' + colors.red(err.lineNumber));
  gutil.log('message: ' + err.message);
  gutil.log('plugin: ' + colors.yellow(err.plugin))
};

gulp.task('clean', () => {
  return del(['./dist/**'])
});

gulp.task('watch', () => {
  gulp.watch('./main/templates/*.html', ['templates']);
  gulp.watch('./main/public/css/**/*.{scss, css}', ['scss']);
  gulp.watch('./main/public/js/**/*.js', ['scripts']);
  gulp.watch('./main/public/images/**/*.{png, jpg}', ['images']);
});

gulp.task('templates', () => {
  return gulp.src('./main/templates/*.html',{base: 'main'})
    .pipe(replace('.scss">', '.css">'))
    .pipe(gulp.dest('dist'))
});

gulp.task('images', ()=> {
  gulp.src('./main/public/images/**/*.{png,jpg}',{base: 'main'})
    .pipe(imagemin({
      optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
      progressive: true //类型：Boolean 默认：false 无损压缩jpg图片
    }))
    .pipe(gulp.dest('dist'))
});

gulp.task('scss', () => {
  var combined = combiner.obj([
    gulp.src(['./main/public/css/**/*.{scss,css}', '!./main/public/css/styles/**'],{base: 'main'}),
    sass().on('error', sass.logError),
    autoprefixer([
      'iOS >= 8',
      'Android >= 4.1'
    ]),
    rename((path) => path.extname = '.css'),
    gulp.dest('dist')
  ]);

  combined.on('error', handleError);
});

gulp.task('scripts', () => {
  return gulp.src('./main/public/js/**/*.js',{base: 'main'})
    .pipe(gulp.dest('dist'))
});


// ---------------------- Tip：以下是生产环境的编译 ------------------------------
gulp.task('templatesPro', () => {
  return gulp.src('./main/templates/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      keepClosingSlash: true
    }))
    .pipe(gulp.dest('./dist'))
});

gulp.task('imagesPro', ()=> {
  gulp.src('./main/public/images/**/*.{png, jpg}')
    .pipe(imagemin({
      optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
      progressive: true //类型：Boolean 默认：false 无损压缩jpg图片
    }))
    .pipe(gulp.dest('./dist'))
});

gulp.task('scssPro', () => {
  var combined = combiner.obj([
    gulp.src(['./main/public/css/**/*.scss', '!./main/public/css/styles/**']),
    sass().on('error', sass.logError),
    autoprefixer([
      'iOS >= 8',
      'Android >= 4.1'
    ]),
    cleancss(),
    replace('/*!css', ''),
    replace('css*/', ''),
    rename((path) => path.extname = '.css'),
    gulp.dest('./dist')
  ]);

  combined.on('error', handleError);
});


//开发环境
gulp.task('dev', () => {
  runSequence(
    'templates',
    'images',
    'scss',
    'scripts',
    'watch'
  );
});

gulp.task('build', [
  'templatesPro',
  'imagesPro',
  'scssPro',
  'scripts'
]);

//生产环境，多了压缩、清除dist所有文件
gulp.task('pro', () => {
  runSequence('build');
});