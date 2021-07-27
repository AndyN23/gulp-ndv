let project_folder = "dist";
let assets_folder = "#assets";

let path = {
    build: {
        html: project_folder + "/",
        css: project_folder + "/css/",
        js: project_folder + "/js/",
        img: project_folder + "/img/",
        fonts: project_folder + "/fonts/"
    },
    src: {
        html: [assets_folder + "/*.html", "!"+ assets_folder + "/_*.html"],
        css: assets_folder + "/scss/style.scss",
        js: assets_folder + "/js/script.js",
        img: assets_folder + "/img/**/*.{jpg,png,svg}",
        fonts: assets_folder + "/fonts/*.ttf"
    },
    watch: {
        html: assets_folder + "/**/*.html",
        css: assets_folder + "/scss/**/*.scss",
        js: assets_folder + "/js/**/*.js",
        img: assets_folder + "/img/**/*.{jpg,png,svg}"
    },
    clean: "./" + project_folder + "/"
}

let {src, dest} = require ('gulp'),
    gulp = require ('gulp'),
    browsersync = require('browser-sync').create(),
    includefile = require('gulp-file-include'),
    del = require ('del'),
    scss = require('gulp-sass')(require('sass')),
    autoprefixer = require('gulp-autoprefixer'),
    group_media = require('gulp-group-css-media-queries'),
    clean_css = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify-es').default;


function browserSync(params) {
    browsersync.init({
        server:{
            baseDir: "./" + project_folder + "/"
        },
        port: 3000,
        notify: false
    })
}

function html(){
    return src(path.src.html)
        .pipe(includefile())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}

function css(){
    return src(path.src.css)
        .pipe(
            scss({
                outputStyle: "expanded"
            })
        )
        .pipe(
            group_media()
        )
        .pipe(
            autoprefixer({
                overrideBrowserlist: ["last 5 versions"],
                cascade: true
            })
        )
        .pipe(dest(path.build.css))
        .pipe(clean_css())
        .pipe(
            rename({
                extname: ".min.css"
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream()) 
}

function js(){
    return src(path.src.js)
        .pipe(includefile())
        .pipe(dest(path.build.js))
        .pipe(
            uglify()
        )
        .pipe(
            rename({
                extname: ".min.js"
            })
        )
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}

function images(){
    return src(path.src.img)
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}


function watchfiles(params){
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
}

function clean(params){
    return del(path.clean)
}

let build =gulp.series(clean, gulp.parallel(js, css, html, images));
let watch = gulp.parallel(build, watchfiles, browserSync);

exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;