'use strict';
//#region Imports
const pipedWebpack = require('piped-webpack');
const gulp = require('gulp')
const spsave = require('gulp-spsave')
const minimist = require('minimist');
var runSequence = require('run-sequence');
var color = require('gulp-color');
var initializer = require('./gulpInitializer');
var fs = require('fs');
var shell = require('shelljs');

//#endregion


/**  Gulp params */
const knownOptions = { string: 'solution', default: { solution: "Common", prod: false } };

/** Read params */
const options = minimist(process.argv.slice(2), knownOptions);
/** Config site */
let context = initializer.GetContext(options.solution, options.prod);

/** run webpack */
gulp.task('build', function () {
    console.log(color("Building bundle started...", 'Green'));
    return gulp.src([])
        .pipe(pipedWebpack(context.webpackContext))
        .pipe(gulp.dest(__dirname + '/', { overwrite: true }));
});
//Upload solution src Files
gulp.task('UploadCode', function () {
    // runs the spsave gulp command on only files the have 
    console.log(color("Uploading src code...", 'Green'));
    let spctx = context.spSaveCoreOptions;
    return gulp.src(context.sourceCodeFolder + "/**")
        .pipe(spsave({ ...spctx, folder: context.sourceCodeDestination }, context.spSaveCreds));
});

gulp.task('UploadBundle', function () {
    // runs the spsave gulp command on only files the have 
    console.log(color("Uploading bundle...", 'Green'));

    let spctx = context.spSaveCoreOptions;
    return gulp.src(context.bundlePath)
        .pipe(spsave({ ...spctx, folder: context.bundleOutPutFileDestination }, context.spSaveCreds));
});

gulp.task('uploadBase', function () {
    let spctx = context.spSaveCoreOptions;
    return gulp.src([".\\*.js", ".\\*.json"])
        .pipe(spsave({ ...spctx, folder: context.solutionFolder }, context.spSaveCreds));
});

gulp.task('uploadSrc', function () {
    let spctx = context.spSaveCoreOptions;
    return gulp.src([".\\src\\**"])
        .pipe(spsave({ ...spctx, folder: context.solutionFolder + '\\src' }, context.spSaveCreds));
});


gulp.task('publishAllCode', function () {
    runSequence('build',
        ['uploadSrc', 'uploadBase'],
        () => console.log(color("Publish ended", 'Green')));
});

gulp.task('publish', function () {
    runSequence('build',
        ['UploadBundle'],
        () => console.log(color("Publish ended", 'Green')));
});

gulp.task('createPage', function () {
    console.log(color("Reading Template ...", 'Green'));
    let content = fs.readFileSync("./PageTemplate.aspx", "utf-8").replace(new RegExp("{solution_name}", 'g'), options.solution);
    console.log(color("Creating Folder ...", 'Green'));
    shell.mkdir('-p', context.pageDirectory);
    console.log(color("Creating file ...", 'Green'));
    fs.writeFileSync(context.pageDirectory + options.solution + ".aspx", content, { flag: "w+" });
    console.log(color("File created !", 'Green'));

});
