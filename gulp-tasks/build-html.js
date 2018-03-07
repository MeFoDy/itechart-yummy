const gulp = require('gulp');
const config = require('./config');
const htmlmin = require('gulp-htmlmin');
const gulpIf = require('gulp-if');

/**
 * Builds HTML
 *
 * @task {build:html}
 * @group {Build}
 */
gulp.task('build:html', () => {
    const src = config.base.src;
    const dist = config.base.dist;
    return gulp
        .src(`${src}/index.html`)
        .pipe(gulpIf('*.html', htmlmin({
            collapseWhitespace: true,
        })))
        .pipe(gulp.dest(dist));
});
