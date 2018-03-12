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
gulp.task('build:js', gulp.parallel([
    () => {
        const src = config.paths.scripts.src;
        const dist = config.paths.scripts.dist;
        return buildJs(src, dist);
    },
    () => {
        const src = config.paths.sw.src;
        const dist = config.paths.sw.dist;
        return buildJs(src, dist);
    },
]));

function buildJs(src, dist) {
    return gulp
        .src(src)
        .pipe(gulpif(config.isDev, sourcemaps.init()))
        .pipe(babel())
        .pipe(
            uglify().on('error', utils.notifyError('Uglify Error'))
        )
        .pipe(gulpif(config.isDev, sourcemaps.write('.')))
        .pipe(gulp.dest(dist));
}
