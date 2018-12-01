'use strict';

// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------

const gulp = require('gulp');
const fractal = require('./fractal.js');
const logger = fractal.cli.console;
const path = require('path');
const notify = require('gulp-notify');
const shell = require('gulp-shell');
const rename = require('gulp-rename');
const watch = require('gulp-watch');

// Sass and CSS Stuff
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const sourcemaps = require('gulp-sourcemaps');
const nodeModuleImport = require('@node-sass/node-module-importer');
const sassLint = require('gulp-sass-lint');
const recursive = require('./tools/css-generator/recursive-readdir');

// JS Stuff
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

const patternPath = path.resolve(__dirname, 'components' );

// Local Server Stuff
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

// Design Tokens
const theoG = require('gulp-theo')
const theo = require('theo')

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

const SassInput = './assets/scss/styles.scss';
const SassOutput = './public/css';
const autoprefixerOptions = { browsers: ['last 2 versions', '> 5%', 'Firefox ESR'] };


// -----------------------------------------------------------------------------
// Sass and CSS Tasks
// -----------------------------------------------------------------------------

gulp.task('css', function() {
  const options = {
  };
  const opts = {
    importer: [nodeModuleImport],
    includePaths: [
      path.resolve(__dirname, 'assets/scss'),
      path.resolve(__dirname, 'components')
    ]
  };
  return gulp
    .src(SassInput)
    .pipe(sourcemaps.init())
    .pipe(sass(opts))
    .on(
      'error',
      notify.onError(function(error) {
        return 'Problem file : ' + error.message;
      })
    )
    .pipe(browserSync.stream())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(SassOutput))
    .pipe(cssnano())
    .pipe(rename(
      {
        suffix: ".min"
      }
    ))
    .pipe(gulp.dest(SassOutput));
});

// Sass Lint
gulp.task('linting', function(done) {
  gulp
    .src(['./components/**/*.s+(a|c)ss', './assets/scss/***.s+(a|c)ss'])
    .pipe(
      sassLint({
        files: {},
        rules: {
          'class-name-format': 0,
          'variable-name-format': 0,
          'no-empty-rulesets': 0,
          'final-newline': 0,
          'space-around-operator': 0,
          'space-after-comma': 0,
          'mixin-name-format': 0
        }
      })
    )
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
  done();
});

// -----------------------------------------------------------------------------
// Image Tasks
// -----------------------------------------------------------------------------
var source = './assets/images',
destination = './public/images';
gulp.task('watch-images', function() {
  gulp.src(source + '/**/*', {base: source})
  .pipe(watch(source, {base: source}))
  .pipe(gulp.dest(destination));
});


gulp.task('scripts', function() {
  return gulp
  .src('./components/**/*.js')
  .pipe(concat('scripts.js'))
  .pipe(gulp.dest('./public/scripts'));
});

// -----------------------------------------------------------------------------
// Pattern Assets
// -----------------------------------------------------------------------------
gulp.task('pattern-assets', function() {
  return gulp
  .src(['./components/**/**/assets/**/*'])
  .pipe(gulp.dest('./public/assets'));
  // .pipe(gulp.dest('./assets'));
});



// -----------------------------------------------------------------------------
// Design Token Tasks
// -----------------------------------------------------------------------------

theo.registerFormat("typography-map", result => {
  let { category, type } = result
    .get("props")
    .first()
    .toJS();
  return `$vf-${category}--${type}: (
${result
  .get("props")
  .map(
  prop => `
  '${prop.get("name")}': (
    'font-size': ${prop.getIn(["value", "font-size"])},
    'font-weight': ${prop.getIn(["value", "font-weight"])},
    'line-height': ${prop.getIn(["value", "line-height"])}
  ),`
  )
  .sort()
  .join("\n")}

);
  `;
});

gulp.task('tokens:typographic-scale', () =>
  gulp.src('./components/vf-design-tokens/typographic-scales/*.yml')
    .pipe(theoG({
      transform: { type: 'web' },
      format: { type: 'typography-map' }
    }))
    .pipe(rename(function (path) {
      path.extname = ".scss";
    }))
    .pipe(gulp.dest('./components/vf-sass-config/variables'))
)

gulp.task('tokens:variables', () =>
  gulp.src('./components/vf-design-tokens/variables/*.yml')
    .pipe(theoG({
      transform: { type: 'web' },
      format: { type: 'scss' }
    }))
    .pipe(gulp.dest('./components/vf-sass-config/variables'))
)

gulp.task('tokens:maps', () =>
  gulp.src(['./components/vf-design-tokens/maps/*.yml', '!./components/vf-design-tokens/typographic-scales/*.yml'])
    .pipe(theoG({
      transform: { type: 'web' },
      format: { type: 'map.scss' }
    }))
    .pipe(gulp.dest('./components/vf-sass-config/variables'))
)

// -----------------------------------------------------------------------------
// Fractal Tasks
// -----------------------------------------------------------------------------


gulp.task('frctlStart', function() {
  fractal.set('project.environment.local', 'true');
  const server = fractal.web.server({
    sync: true
  });
  server.on('error', err => logger.error(err.message));
  return server.start().then(() => {
    logger.success(`Fractal server is now running at ${server.url}`);
    logger.success(`Network URL: ${server.urls.sync.external}`);
  });
});

gulp.task('frctlBuild', function() {
  fractal.set('project.environment.production', 'true');
  const builder = fractal.web.builder();
  builder.on('progress', (completed, total) =>
    logger.update(`Exported ${completed} of ${total} items`, 'info')
  );
  builder.on('error', err => logger.error(err.message));
  return builder.build().then(() => {
    logger.success('Fractal build completed!');

    // Copy compiled css/js and other assets
    gulp.src('./public/**/*')
    .pipe(gulp.dest('./build'));
    logger.success('Copied `/public` assets.');
  });
});

// -----------------------------------------------------------------------------
// CSS Generator Tasks
// -----------------------------------------------------------------------------

var genCss = function (option) {
  var file_name = path.basename(path.dirname(option.file_path)) + ".css"
  return gulp.src(option.file_path)
    .pipe(sass({
      includePaths: [
        path.resolve(__dirname, 'components/vf-sass-config/variables'),
        path.resolve(__dirname, 'components/vf-sass-config/functions'),
        path.resolve(__dirname, 'components/vf-sass-config/mixins')
      ],
      outputStyle: 'expanded'
    })
    .on('error', sass.logError))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(rename(file_name))
    .pipe(gulp.dest(option.dir));
};

gulp.task('CSSGen', function(done) {
  recursive(patternPath, ['*.css'], function (err, files) {
    files.forEach(function(file) {
      if (file.file.indexOf('index.scss') > -1) {
        genCss(file);
      }
    });
  });
  done();
});

// -----------------------------------------------------------------------------
// Watch Tasks
// -----------------------------------------------------------------------------

gulp.task('watch', function(done) {
  fractal.watch();
  gulp.watch('./**/*.scss', gulp.series('css')).on('change', reload);
  gulp.watch('./assets/images', gulp.series('watch-images')).on('change', reload);
  gulp.watch(['./assets/scripts/**/*.js','./components/**/*.js'], gulp.series('scripts')).on('change', reload);
  gulp.watch('./components/**/**/assets/*', gulp.series('pattern-assets')).on('change', reload);
});


// -----------------------------------------------------------------------------
// Default Tasks
// -----------------------------------------------------------------------------

// Build as a static site for CI
gulp.task('build', gulp.series(
    'css', 'pattern-assets', 'scripts', 'frctlBuild'
));

gulp.task('dev', gulp.parallel(
    'frctlStart', 'pattern-assets', 'css', 'scripts', 'watch'
));

gulp.task('tokens', gulp.parallel(
    'tokens:variables', 'tokens:typographic-scale', 'tokens:maps'
));

gulp.task('component', shell.task(['yo ./tools/component-generator']));
