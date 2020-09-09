'use strict'

var gulp = require('gulp'),

  browserSync = require('browser-sync'),
  sourcemaps = require('gulp-sourcemaps'), 
  sass = require('gulp-sass'),
  sassGlob = require('gulp-sass-glob'), 
  rename = require('gulp-rename'), 
  postcss = require('gulp-postcss'), 
  autoprefixer = require('autoprefixer'),
  mqpacker = require('css-mqpacker'), 
  cssnano = require('gulp-cssnano'), 
  plumber = require('gulp-plumber'), 
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify-es').default,
  imagemin = require('gulp-imagemin'), 
  tinypng = require('gulp-tinypng-nokey'), 
  pngquant = require('imagemin-pngquant'), 

  del = require('del'), 
  run = require('run-sequence'), 
  cache = require('gulp-cache')

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'src'
    },
    notify: false 
  })
})

gulp.task('style', function() { 
  var mainMinCss = gulp.src('src/sass/style.scss')
    .pipe(plumber())
    .pipe(sassGlob()) 
    .pipe(sass()) 
    .pipe(postcss([
      autoprefixer({
        browsers: ['last 10 versions']
      }),
      mqpacker({
        sort: true
      })
    ]))
    .pipe(cssnano())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.reload({
      stream: true
    })) 

  var normalizeMinCss = gulp.src('src/css/normalize.css')
    .pipe(cssnano())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('src/css'))
})

gulp.task('style:dev', function() {
  var mainMinCss = gulp.src('src/sass/style.scss')
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sassGlob()) 
    .pipe(sass()) 
    .pipe(postcss([
      autoprefixer({
        browsers: ['last 10 versions']
      }),
      mqpacker({
        sort: true
      })
    ]))
    .pipe(cssnano())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.reload({
      stream: true
    })) 


  var normalizeMinCss = gulp.src('src/css/normalize.css')
    .pipe(cssnano())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('src/css'))
})

gulp.task('css-libs', function() {
  return gulp.src('src/css/libs.css')
    .pipe(rename({
      suffix: '.min'
    })) 
    .pipe(cssnano())
    .pipe(gulp.dest('src/css'))
})

gulp.task('js', function() {
  var commonMinJs = gulp.src('src/js/common.js')
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('src/js'))
})

gulp.task('js-libs', function() {
  return gulp.src([
    ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify()) 
    .pipe(gulp.dest('src/js'))
})

gulp.task('img', function() {
  return gulp.src('src/img/**/*')
    .pipe(cache(imagemin([ 
      imagemin.gifsicle({
        interlaced: true
      }),
      imagemin.jpegtran({
        progressive: true
      }),
      imagemin.svgo(),
      imagemin.optipng({
        optimizationLevel: 3
      }),
      pngquant({
        quality: '65-70',
        speed: 5
      })
    ], {
      verbose: true 
    })))
    .pipe(tinypng())
    .pipe(gulp.dest('build/img'))
})

gulp.task('clean', function() {
  return del.sync('build')
})

gulp.task('copy', function() {

  var buildHtml = gulp.src('src/*.html')
    .pipe(gulp.dest('build'))

  var buildFonts = gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('build/fonts'))

  var buildCss = gulp.src('src/css/*.min.css')
    .pipe(gulp.dest('build/css'))

  var buildJs = gulp.src('src/js/*.min.js')
    .pipe(gulp.dest('build/js'))

  var buildFavicon = gulp.src([
      'src/android-icon.png',
      'src/apple-icon.png',
      'src/favicon.png'
    ])
    .pipe(gulp.dest('build'))

})

gulp.task('watch', ['browser-sync', 'style:dev', 'js', 'css-libs', 'js-libs'], function() {
  gulp.watch('src/**/*.html', browserSync.reload) 
  gulp.watch('src/sass/**/*.scss', ['style:dev']) 
  gulp.watch('src/js/**/*.js', ['js'])
})

gulp.task('build', function(fn) {
  run(
    'clean',
    'css-libs',
    'js-libs',
    'style',
    'js',
    'img',
    'copy',
    fn
  )
})

gulp.task('clear', function(callback) {
  return cache.clearAll()
})