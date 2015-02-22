module.exports = function(grunt) {

  // Project configuration.
	grunt.initConfig({
		nodemon:{
			script: 'bin/www',
			options: {
				ignore: ['public/**','gruntfile'],
				watch: ['app.js', 'routes/**/*.js']
			}
		},
		jshint: {
			files: ['app.js','routes/**/*.js', 'public/javascripts/**']
		},
		bower_concat: {
			all: {
				dest: 'public/javascripts/bundle.js',
				cssDest: 'public/stylesheets/bundle.css',
				bowerOptions: {
					relative: false
				}
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-bower-concat');

	grunt.registerTask('default', ['jshint', 'nodemon']);

};
