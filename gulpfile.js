const gulp = require('gulp');
const ts = require('gulp-typescript');
const JSON_FILES = ['src/*.json', 'src/**/*.json'];
const tsProject = ts.createProject('tsConfig.json');
function scripts() {
    const tsResult = tsProject.src()
        .pipe(tsProject());
    return tsResult.js.pipe(gulp.dest('dist'));
}
function watch() {
    gulp.watch('src/**/*.ts', ['scripts']);

}
function assets() {
    return gulp.src(JSON_FILES)
        .pipe(gulp.dest('dist'));

}
const build = gulp.series(gulp.parallel(scripts, assets));

exports.assets = assets;
exports.scripts = scripts;
exports.watch = watch;
exports.build = build;

exports.default = build;