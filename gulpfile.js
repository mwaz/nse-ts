const gulp = require('gulp');
const ts = require('gulp-typescript');
const JSON_FILES = ['src/*.json', 'src/**/*.json'];
const YAML_FILES = ['src/*.yaml', 'src/**/*.yaml'];

const assetFiles = [JSON_FILES, YAML_FILES];

const tsProject = ts.createProject('tsConfig.json');
function scripts() {
    const tsResult = tsProject.src()
        .pipe(tsProject());
    return tsResult.js.pipe(gulp.dest('dist'));
}
function watch() {
    gulp.watch('src/**/*.ts', ['scripts']);

}
async function assets() {
    assetFiles.forEach(async asset => {
        return await gulp.src(asset)
        .pipe(gulp.dest('dist'));
        
    });
    // return gulp.src(YAML_FILES )
    //     // gulp.src(JSON_FILES)
    //     .pipe(gulp.dest('dist'));
}
const build = gulp.series(scripts, assets);

exports.assets = assets;
exports.scripts = scripts;
exports.watch = watch;
exports.build = build;

exports.default = build;