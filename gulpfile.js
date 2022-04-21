const { src,dest,series,watch,registry } = require('gulp')
const concat = require('gulp-concat')
const htmlMin = require('gulp-htmlmin')
const autoprefixer = require('gulp-autoprefixer')
const cleanCss = require('gulp-clean-css')
const svgSprite = require('gulp-svg-sprite')
const image = require('gulp-image')
const webp = require('gulp-webp')
const fileInclude = require('gulp-file-include')
const uglify = require('gulp-uglify-es').default
const notify = require('gulp-notify')
const sass = require('gulp-sass')(require('sass'))
const sourcemaps = require('gulp-sourcemaps')
const del = require('del')
const browserSync = require('browser-sync').create()

const clean = () => {
  return del(['dist'])
}

const fonts = () => {
  return src('src/font/**').pipe(dest('dist/font'))
}
const scroll = () => {
  return src('src/documents/**').pipe(dest('dist/js'))
}

const normalise = () => {
  return src('src/style/normalise.css')
    .pipe(
      cleanCss({
        level: 2,
      })
    )
    .pipe(dest('dist/style'))
}

const svgSprites = () => {
  return src('src/img/svg/*.svg')
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: '../sprite.svg',
          },
        },
      })
    )
    .pipe(dest('dist/images'))
}

const htmlInclude = () => {
  return src(['src/**/*.html']).pipe(fileInclude()).pipe(dest('dist')).pipe(browserSync.stream())
}

const imagesDev = () => {
  return src(['src/img/**/*.jpg','src/img/**/*.jpeg'])
    .pipe(image())
    .pipe(webp())
    .pipe(dest('dist/images'))
}

const imagesNoChanges = () => {
  return src(['src/img/**/*.png','src/img/**/*.mp4','src/img/**/*.svg','src/img/**/*.ico'])
    .pipe(image())
    .pipe(dest('dist/images'))
}

const stylesDev = () => {
  return src('src/style/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write('./'))
    .pipe(dest('dist/style'))
    .pipe(browserSync.stream())
}

const htmlMinifyDev = () => {
  return src('src/**/*.html').pipe(dest('dist')).pipe(browserSync.stream())
}

const scriptsDev = () => {
  return src(['src/js/*.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write())
    .pipe(dest('dist/js'))
    .pipe(browserSync.stream())
}

const watchFilesDev = () => {
  browserSync.init({
    server: {
      baseDir: 'dist',
    },
  })
}
watch('src/**/*.html',htmlMinifyDev)
watch('src/style/**/*.scss',stylesDev)
watch('src/images/svg/**/*.svg',svgSprites)
watch('src/js/**/*.js',scriptsDev)
watch('src/fonts/**',fonts)
watch('src/**/*.html',htmlInclude)

exports.dev = series(
  clean,
  fonts,
  scroll,
  htmlMinifyDev,
  scriptsDev,
  normalise,
  stylesDev,
  imagesDev,
  svgSprites,
  htmlInclude,
  imagesNoChanges,
  watchFilesDev
)

const imagesBuild = () => {
  return src(['src/img/**/*.jpg','src/img/**/*.jpeg'])
    .pipe(image())
    .pipe(webp())
    .pipe(dest('dist/images'))
}

const stylesBuild = () => {
  return src('src/style/**/*.scss')
    .pipe(sass())
    .pipe(
      autoprefixer({
        cascade: false,
        grid: true,
        overrideBrowserslist: ['last 5 versions'],
      })
    )
    .pipe(
      cleanCss({
        level: 2,
      })
    )
    .pipe(dest('dist/style'))
}
const htmlMinifyBuild = () => {
  return src('dist/**/*.html')
    .pipe(
      htmlMin({
        collapseWhitespace: true,
      })
    )
    .pipe(dest('dist'))
}

const scriptsBuild = () => {
  return src(['src/js/*.js'])
    .pipe(concat('app.js'))
    .pipe(
      uglify({
        toplevel: true,
      }).on('error',notify.onError())
    )
    .pipe(dest('dist/js'))
}

exports.build = series(
  clean,
  fonts,
  scroll,
  scriptsBuild,
  normalise,
  stylesBuild,
  imagesBuild,
  htmlInclude,
  imagesNoChanges,
  svgSprites,
  htmlMinifyBuild
)
