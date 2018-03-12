const util = require('gulp-util');

const base = {
    src: 'source',
    dist: 'dist',
};

const paths = {
    images: {
        src: `${base.src}/images`,
        dist: `${base.dist}/images`,
    },
    fonts: {
        src: `${base.src}/fonts`,
        dist: `${base.dist}/fonts`,
    },
    scripts: {
        src: `${base.src}/js/**/*.js`,
        dist: `${base.dist}/js`,
    },
    styles: {
        src: {
            scss: `${base.src}/scss/**/*.scss`,
            css: `${base.src}/css/**/*.css`,
            vendor: `${base.src}/vendor/**/*.css`,
        },
        dist: {
            css: `${base.dist}/css`,
        },
    },
};

const autoprefixer = ['last 2 versions', 'IE 9'];

const isDev = !util.env.production;

module.exports = {
    autoprefixer,
    base,
    paths,
    isDev,
};
