module.exports = function(grunt) {

	grunt.loadNpmTask('grunt-contrib-jshint');
	grunt.loadNpmTask('grunt-simple-mocha');
	grunt.loadNpmTask('grunt-nodemon');


	var srcFiles = ['Gruntfile.js', './models/**/*.js', './test/**/*test.js'];

	grunt.intiConfig({

		jshint:{
			dev:{
				src: srcFiles
			},

			options:{
				jshint:true
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
};
