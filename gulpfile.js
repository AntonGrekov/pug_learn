var gulp 						= require("gulp"),
	browserSync				= require("browser-sync"),
	// cssNano					= require("cssnano"),
	sass							= require("gulp-sass"),
	plumber						= require("gulp-plumber"),
	gutil							= require("gulp-util"),
	uglifyJs	    		= require("gulp-uglify-es").default,
	rename						= require("gulp-rename"),
	pug								= require("gulp-pug"),	
	concat						= require("gulp-concat");

// Source code paths, build destination, other vars

var paths = {

				cwd: './dist',

				html: {
					src: 'dist/*.html'
				},

				pug: {
					watch: 'src/**/*.pug',
					src: 'src/*.pug',
					dest: 'dist/'
				},

				styles: {
					src: 'src/sass/**/*.+(sass|scss)',  	
					dest: 'dist/css/'
				}, 

				js: {
					cwd: 'src/js',
					src: ['src/js/*.js', '!src/js/*.min.js'],
					srcComp: 'src/js/*.min.js',
					dest: 'dist/js'
				}

}



gulp.task('server', () => {
	browserSync.init({
		server: paths.cwd,
		notify: false,
	});
});



gulp.task('pug', (cb) => {
	gulp.src(paths.pug.src)
	 .pipe(plumber(function (error) {
		gutil.log(error.message);
		this.emit('end');
	 }))
	 .pipe(pug({
		pretty: true
	 }))
	 .pipe(gulp.dest(paths.pug.dest))
	 .pipe(browserSync.reload({ stream: true }));
	 cb();
})	

gulp.task('sass', () => {
	return gulp.src(paths.styles.src)
		   .pipe(plumber(function(error) {
		   	gutil.log(error.message);
		   	this.emit('end');
		   }))
		   .pipe(sass())
		   .pipe(gulp.dest(paths.styles.dest))
		   .pipe(browserSync.reload({stream:true}))
});



gulp.task('uglify', function() {
	return gulp.src(paths.js.cwd + "/test.js")
		   .pipe(uglifyJs())
		   .on('error', function (err) {
				console.error('Error in js task', err.toString());
			})
		   .pipe(rename(function(path) {
			   path.basename += ".min"
		   }))
		   .pipe(gulp.dest(paths.js.cwd));
})


gulp.task('build_js',  function () {
	return gulp.src(paths.js.cwd + "/test.js")
				.pipe(gulp.dest(paths.js.dest))
		 	   .pipe(browserSync.reload({ stream: true }));
});


// gulp.task('compress', gulp.series('uglify', () => {
// 	return gulp.src(paths.js.srcComp)
// 		   .pipe(concat('all.min.js'))
// 		   .pipe(gulp.dest(paths.js.dest))
// }));



function reloadHTML(cb) {
		browserSync.reload();
		cb();
}


gulp.task('watch', gulp.parallel('server', function () {
	 gulp.watch(paths.html.src, reloadHTML);
	 gulp.watch(paths.styles.src, gulp.series('sass'));
	//  gulp.watch(paths.js.src, gulp.series('compress'));
	 gulp.watch(paths.pug.watch, gulp.series('pug', reloadHTML));
	 gulp.watch(paths.js.cwd + "/test.js", gulp.series('build_js')); 
 	//  gulp.watch(paths.styles.dest, reloadHTML)
}));


gulp.task('default', gulp.series('watch'));