/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
  
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
      
    // Task configuration.  

    // JSHint
    jshint: {
      gruntfile: {
        src: 'Gruntfile.js'
      },
			files: ['js/createAccount.js'],
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
        globals: { "$": false }
      }
    },
        
    // Uglify
    uglify: {
      options: {
        mangle: false
      },
      dist: {
        files: {
          'js/createAccount.min.js': 'js/createAccount.js'
        }
      }
    },
		
		// SASS
		sass: {
			dist: {
				files: {
					'css/custom.css': 'css/custom.scss'
				}
			}
		},    

    // SVG min
    svgmin: {
			options: {
				plugins: [
					{
					removeViewBox: false
					}, {
					removeUselessStrokeAndFill: false
					}
				]
			},
			dist: {
				files: {
				'assets/logo.min.svg': 'assets/logo.svg'
				}
			}
    },
        
    // Watch
    watch: {

      // gruntfile: jshint
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile']
      },
          
			// css: sass
			css: {
				files: 'css/**/*.scss',
				tasks: ['sass']
			},
			
      // js: jshint, uglify
      js: {
				files: 'js/createAccount.js',
        tasks: ['jshint', 'uglify']
      },

      // svg: svgmin
			svgs: {
				files: 'assets/logo.svg',
				tasks: ['svgmin']
			}    
            			      
    },
		
		// Copy 
		copy: {
			topFiles: {
				cwd: '.',                              // set working folder / root to copy
				src: ['*.html', '*.php', '*.txt'],     // copy only selected file types
				dest: '../../openShift/accountDemo',   // destination folder
				expand: true                           // required when using cwd
			},		
			assetFiles: {
				cwd: 'assets',
				src: '**/*.min.svg',
				dest: '../../openShift/accountDemo/assets',
				expand: true
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

  // Load plugins.
  grunt.loadNpmTasks( 'grunt-contrib-jshint' );
  grunt.loadNpmTasks( 'grunt-contrib-uglify' );
  grunt.loadNpmTasks( 'grunt-contrib-sass' );
  grunt.loadNpmTasks( 'grunt-svgmin' );  
  grunt.loadNpmTasks( 'grunt-contrib-watch' );  
  grunt.loadNpmTasks( 'grunt-contrib-copy');

  // Default task.
  grunt.registerTask( 'default', 'watch' );

  // Copy task.
  grunt.registerTask( 'copyDemo', 'copy' );  

};