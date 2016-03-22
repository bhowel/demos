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
				'assets/createAccountLogo.min.svg': 'assets/createAccountLogo.svg'
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
				files: 'assets/createAccountLogo.svg',
				tasks: ['svgmin']
			}    
            			      
    },

		// UnCSS
		uncss: {
			dist: {
				options: {
					ignoreSheets: [/fonts.googleapis/, /normalize.min.css/, /magic.min.css/],
					ignore: ['input.parsley-success', 'select.parsley-success', 'textarea.parsley-success', 'input.parsley-error', 'select.parsley-error', 'textarea.parsley-error', '.parsley-errors-list', '.parsley-errors-list.filled']
				},		
				files: {
					'css/tidy.css': ['index.html', 'ack.html']
				}
			}
		},

		// CSSComb
    csscomb: {
			dist: {
				files: {
				  'css/pretty.css': ['css/tidy.css']
				}
			}
    },
    
		// CSSMin
		cssmin: {
			dist: {
				files: [
						{ src: 'css/pretty.css', dest: 'css/createAccount.min.css' }
				]
			}
		},
                		
		// Copy 
		copy: {
			topFiles: {
				cwd: '.',                              // set working folder / root to copy
				src: ['*.html', '*.php', '*.txt', '*.ico'],     // copy only selected file types
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
				src: ['**/normalize.min.css', '**/magic.min.css', '**/createAccount.min.css'],
				dest: '../../openShift/accountDemo/css',
				expand: true 
			},
			jsFiles: {
				cwd: 'js',
				src: ['**/*.min.js', '**/*.map'],
				dest: '../../openShift/accountDemo/js',
				expand: true 
			}					
		},

		// HTML refs
    htmlrefs: {
      dist: {
				files: [
						{ src: '../../openShift/accountDemo/index.html', dest: '../../openShift/accountDemo/index.html' },
						{ src: '../../openShift/accountDemo/ack.html', dest: '../../openShift/accountDemo/ack.html' }
				]
      }
    }
      				   
  });

  // Load plugins.
  grunt.loadNpmTasks( 'grunt-contrib-jshint' );
  grunt.loadNpmTasks( 'grunt-contrib-uglify' );
  grunt.loadNpmTasks( 'grunt-contrib-sass' );
  grunt.loadNpmTasks( 'grunt-svgmin' );  
  grunt.loadNpmTasks( 'grunt-contrib-watch' );
  grunt.loadNpmTasks( 'grunt-uncss' );
  grunt.loadNpmTasks( 'grunt-csscomb' );
  grunt.loadNpmTasks( 'grunt-contrib-cssmin' );  
  grunt.loadNpmTasks( 'grunt-contrib-copy');
  grunt.loadNpmTasks( 'grunt-htmlrefs' );

  // Default task.
  grunt.registerTask( 'default', 'watch' );

  // Process SVG task.
  grunt.registerTask( 'processSVG', 'svgmin' ); 
  
  // Process CSS task.
  grunt.registerTask( 'processCSS', ['uncss', 'csscomb', 'cssmin'] ); 
  
  // Copy task.
  grunt.registerTask( 'copyDemo', 'copy' );  

  // HTML refs task.
  grunt.registerTask( 'fixHTMLRefs', 'htmlrefs' );    

};
