const gulp = require('gulp');
const config = require('./config');
const browserSync = require('browser-sync');
require('./build');

/**
 * Serves the site
 *
 * @task {serve}
 * @group {Serve}
 */
gulp.task('serve', gulp.series('build', () => {
    const dist = config.base.dist;
    browserSync.init({
        server: {
            baseDir: dist,
        },
        ghostMode: {
            scroll: true,
        },
        notify: false,
        open: false,
        port: 3001,
        files: [
            `${dist}/images/**/*`,
            `${dist}/**/*.css`,
            `${dist}/**/*.js`,
            `${dist}/**/*.html`,
        ],
    });
    gulp.watch(config.paths.styles.src.scss, gulp.series('build:scss'));
    gulp.watch(config.paths.scripts.src, gulp.series('build:js'));
    gulp.watch(`${config.base.src}/index.html`, gulp.series('build:html'));
}));
