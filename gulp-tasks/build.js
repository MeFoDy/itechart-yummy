const gulp = require('gulp');
require('./clean');
require('./copy-static');
require('./build-scss');
require('./build-cache-bust');
require('./build-html');

/**
 * Builds the site
 *
 * @task {build}
 * @group {Build}
 * @order {0}
 */
gulp.task('build', gulp.series(
    'clean',
    'copy:static',
    gulp.parallel('build:scss', 'build:html'),
    'build:cache-bust',
));
