const { src, dest, watch, series, parallel } = require('gulp');
const browserSync = require('browser-sync').create();
const gulpSass = require('gulp-sass')(require('sass'));
const nunjucksRender = require('gulp-nunjucks-render');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const terser = require('gulp-terser');
const sourcemaps = require('gulp-sourcemaps');
const fs = require('fs/promises');

const paths = {
  templates: {
    src: 'src/pages/**/*.njk',
    watch: 'src/**/*.njk',
    dest: 'dist/'
  },
  styles: {
    src: 'src/scss/main.scss',
    watch: 'src/scss/**/*.scss',
    dest: 'dist/css/'
  },
  scripts: {
    src: 'src/js/**/*.js',
    dest: 'dist/js/'
  },
  assets: {
    src: 'src/assets/**/*',
    dest: 'dist/assets/'
  }
};

async function clean() {
  await fs.rm('dist', { recursive: true, force: true });
}

function templates() {
  return src(paths.templates.src)
    .pipe(nunjucksRender({
      path: ['src/templates'],
      envOptions: {
        autoescape: false,
        trimBlocks: true,
        lstripBlocks: true
      }
    }))
    .pipe(rename({ extname: '.html' }))
    .pipe(dest(paths.templates.dest))
    .pipe(browserSync.stream());
}

function styles() {
  return src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(gulpSass({ outputStyle: 'expanded' }).on('error', gulpSass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(dest(paths.styles.dest))
    .pipe(cleanCSS({ level: 2 }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

function scripts() {
  return src(paths.scripts.src, { sourcemaps: true })
    .pipe(dest(paths.scripts.dest, { sourcemaps: true }))
    .pipe(terser())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(paths.scripts.dest, { sourcemaps: true }))
    .pipe(browserSync.stream());
}

function assets() {
  return src(paths.assets.src, { encoding: false })
    .pipe(dest(paths.assets.dest))
    .pipe(browserSync.stream());
}

function serve(done) {
  browserSync.init({
    server: { baseDir: 'dist' },
    notify: false,
    open: true,
    ghostMode: false,
    ui: false
  });
  done();
}

function watcher() {
  watch(paths.templates.watch, templates);
  watch(paths.styles.watch, styles);
  watch(paths.scripts.src, scripts);
  watch(paths.assets.src, assets);
}

const build = series(clean, parallel(templates, styles, scripts, assets));

exports.clean = clean;
exports.html = templates;
exports.templates = templates;
exports.styles = styles;
exports.scripts = scripts;
exports.assets = assets;
exports.serve = serve;
exports.build = build;
exports.default = series(build, parallel(serve, watcher));
