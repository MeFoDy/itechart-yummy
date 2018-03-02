const gulp = require('gulp');
const config = require('./config');

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
}));
