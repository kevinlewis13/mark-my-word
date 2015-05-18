module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-simple-mocha');
	grunt.loadNpmTasks('grunt-nodemon');

	var srcFiles = ['Gruntfile.js', './models/**/*.js', './test/**/*test.js'];

	grunt.initConfig({

		jshint:{
			dev:{
				src: srcFiles
			},

			options:{
				jshintrc:true
			}
		},

		simplemocha:{
			dev:{
				src:['./test/**/*test.js']
			}
		},

		nodemon:{
			dev:{
				src: srcFiles
			}
		}
	});

	grunt.registerTask('test', ['jshint:dev', 'simplemocha:dev']);
	grunt.registerTask('default', ['test']);
};
