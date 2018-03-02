const gulp = require('gulp');
const config = require('./config');
const cachebust = require('gulp-cache-bust');

/**
 * Lets browser know that styles need to be updated
 *
 * @task {build:cache-bust}
 * @group {Build}
 */
gulp.task('build:cache-bust', () => {
    const dist = config.base.dist;
    return gulp
        .src(`${dist}/index.html`)
        .pipe(cachebust())
        .pipe(gulp.dest(dist));
});
