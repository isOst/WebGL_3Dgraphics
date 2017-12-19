var gulp = require("gulp");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var sourcemaps = require("gulp-sourcemaps");
var browserSync = require("browser-sync").create();

gulp.task("html", function() {
    return gulp.src("src/index.html")
        .pipe(gulp.dest("dist"))
});

gulp.task("js", function() {
   return gulp.src("./src/**/*.js")
       .on("error", function (err) {
           console.error("Error!: ", err.message);
       })
       .pipe(sourcemaps.init())
       .pipe(babel())
       .pipe(concat("script.js"))
       .pipe(sourcemaps.write("./"))
       .pipe(gulp.dest("./dist/"));
});

gulp.task("browser-sync", function() {
    browserSync.init({
        server: { baseDir: "./dist/"}
    })
});

gulp.task("watch", ["browser-sync"], function() {
    gulp.watch("src/**/*.js", ["js", browserSync.reload]);
    gulp.watch("src/index.html", ["html", browserSync.reload]);
});

gulp.task("default", ["html", "js", "watch"]);