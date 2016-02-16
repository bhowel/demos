/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
			js: {
				src: 'js/*.js',
				dest: 'js/concat.js'
			}
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {}
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'qunit']
      },
			css: {
				files: 'css/**/*.scss',
				tasks: ['sass']
			}      
    },
		sass: {
			dist: {
				files: {
					'css/custom.css': 'css/custom.scss'
				}
			}
		},
		copy: {
			topFiles: {
				cwd: '.',
				src: ['*.html', '*.php', '*.txt'],
				dest: '../../openShift/accountDemo',
				expand: true 
			},		
			assetFiles: {
				cwd: 'assets',                              // set working folder / root to copy
				src: '**/*',                                // copy all files and subfolders
				dest: '../../openShift/accountDemo/assets', // destination folder
				expand: true                                // required when using cwd
			},
			cssFiles: {
				cwd: 'css',
				src: ['**/*.css', '**/*.map'],
				dest: '../../openShift/accountDemo/css',
				expand: true 
			},
			jsFiles: {
				cwd: 'js',
				src: ['**/*.min.js', '**/*.map'],
				dest: '../../openShift/accountDemo/js',
				expand: true 
			}					
		}		   
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task.
  //grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'sass']);
  grunt.registerTask('default', ['watch', 'sass'], ['copy']);

};
