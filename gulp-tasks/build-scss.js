const gulp = require('gulp');
const gulpif = require('gulp-if');
const config = require('./config');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const utils = require('./utils');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');

/**
 * Builds SCSS files
 *
 * @task {build:scss}
 * @group {Build}
 */
gulp.task('build:scss', () => {
    const src = config.paths.styles.src.scss;
    const dist = config.paths.styles.dist.css;
    return gulp
        .src(src)
        .pipe(gulpif(config.isDev, sourcemaps.init()))
        .pipe(
            sass({
                errLogToConsole: true,
                outputStyle: 'nested',
                includePaths: ['node_modules'],
            }).on('error', utils.notifyError('Sass Error'))
        )
        .pipe(autoprefixer({
            browsers: config.autoprefixer,
            cascade: false,
        }))
        .pipe(csso().on('error', utils.notifyError('Csso Error')))
        .pipe(gulpif(config.isDev, sourcemaps.write('.')))
        .pipe(gulp.dest(dist));
});
