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
			files: ['js/index.js'],
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
          'js/index.min.js': 'js/index.js'
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
				files: 'js/index.js',
        tasks: ['jshint', 'uglify']
      }   
            			      
    },

		// UnCSS
		uncss: {
			dist: {
				options: {
					ignoreSheets: [/fonts.googleapis/, /normalize.min.css/, /font-awesome.min.css/],
					ignore: ['.reveal-element', 
					         '.reveal-element.slide-left', 
					         '.reveal-element.slide-left.in-view', 
					         '.reveal-element.slide-up', 
					         '.reveal-element.slide-up.in-view']
				},		
				files: {
					'css/tidy.css': ['index.html']
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
				files: {
				  'css/custom.min.css': ['css/pretty.css']
				}
			}
		},
                		
		// Copy 
		copy: {
			topFiles: {
				cwd: '.',
				src: ['*.html', '*.txt', '*.ico'],
				dest: '../../dist/netlifyTaxRhino',
				expand: true 
			},		
			assetFiles: {
				cwd: 'assets',
				src: '**/*',
				dest: '../../dist/netlifyTaxRhino/assets',
				expand: true
			},
			cssFiles: {
				cwd: 'css',
				src: ['**/normalize.min.css', '**/custom.min.css'],
				dest: '../../dist/netlifyTaxRhino/css',
				expand: true 
			},
			jsFiles: {
				cwd: 'js',
				src: ['**/*.min.js', '**/*.map'],
				dest: '../../dist/netlifyTaxRhino/js',
				expand: true 
			}					
		},

		// HTML refs
    htmlrefs: {
      dist: {
				files: [
						{ src: '../../dist/netlifyTaxRhino/index.html', dest: '../../dist/netlifyTaxRhino/index.html' }
				]
      }
    }
      				   
  });

  // Load plugins.
  grunt.loadNpmTasks( 'grunt-contrib-jshint' );
  grunt.loadNpmTasks( 'grunt-contrib-uglify' );
  grunt.loadNpmTasks( 'grunt-contrib-sass' );  
  grunt.loadNpmTasks( 'grunt-contrib-watch' );
  grunt.loadNpmTasks( 'grunt-uncss' );
  grunt.loadNpmTasks( 'grunt-csscomb' );
  grunt.loadNpmTasks( 'grunt-contrib-cssmin' );  
  grunt.loadNpmTasks( 'grunt-contrib-copy');
  grunt.loadNpmTasks( 'grunt-htmlrefs' );

  // Default task.
  grunt.registerTask( 'default', 'watch' );

  // Final task.
  grunt.registerTask( 'final', ['uncss', 'csscomb', 'cssmin', 'copy', 'htmlrefs'] );     

};
