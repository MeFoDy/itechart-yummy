const gulp = require('gulp');
const config = require('./config');
const utils = require('./utils');
const csso = require('gulp-csso');

/**
 * Copies static files to dist
 *
 * @task {copy:static}
 * @group {Build}
 */
gulp.task('copy:static', gulp.parallel(() => {
    const images = config.paths.images;
    return gulp
        .src(`${images.src}/**/*`)
        .pipe(gulp.dest(images.dist));
}, () => {
    const fonts = config.paths.fonts;
    return gulp
        .src(`${fonts.src}/**/*`)
        .pipe(gulp.dest(fonts.dist));
}, () => {
    const normalize = config.paths.normalize;
    return gulp
        .src(normalize.src)
        .pipe(csso().on('error', utils.notifyError('Csso Error')))
        .pipe(gulp.dest(normalize.dist));
}));
