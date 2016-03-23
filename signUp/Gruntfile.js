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
      }    
            			      
    }
      				   
  });

  // Load plugins.
  grunt.loadNpmTasks( 'grunt-contrib-jshint' );
  grunt.loadNpmTasks( 'grunt-contrib-uglify' );
  grunt.loadNpmTasks( 'grunt-contrib-sass' ); 
  grunt.loadNpmTasks( 'grunt-contrib-watch' );

  // Default task.
  grunt.registerTask( 'default', 'watch' );   

};
