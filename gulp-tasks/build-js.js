const gulp = require('gulp');
const gulpif = require('gulp-if');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const config = require('./config');
const utils = require('./utils');

/**
 * Builds JS
 *
 * @task {build:js}
 * @group {Build}
 */
gulp.task('build:js', () => {
    const src = config.paths.scripts.src;
    const dist = config.paths.scripts.dist;
    return gulp
        .src(src)
        .pipe(gulpif(config.isDev, sourcemaps.init()))
        .pipe(babel({
            presets: ['env'],
        }))
        .pipe(
            uglify().on('error', utils.notifyError('Uglify Error'))
        )
        .pipe(gulpif(config.isDev, sourcemaps.write('.')))
        .pipe(gulp.dest(dist));
});
