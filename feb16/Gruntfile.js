var path = require( 'path' );
module.exports = function( grunt ) {
  // Project configuration.
  grunt.initConfig( {
    pkg: grunt.file.readJSON( 'package.json' ),
    web_server: {
      options: {
        cors: true,
        port: 8000,
        nevercache: true,
        logRequests: true
      },
      foo: 'bar' // For some reason an extra key with a non-object value is necessary 
    },
    coffee: {
      compile: {
        files: {
          'src/game-files-compiled.js': [ 
          '../base/controller-one-two-click.coffee'
          ,'coffee/**.coffee' 
          ],
          'src/resource-compiled.js': [
            './resources.coffee'    
          ]
        }
      }
    },
    watch: {
      coffeechanges: {
        files: [ 
          'coffee/**.coffee'
          , 'resources.coffee'
          , '../base/**.coffee'
        ],
        tasks: [ 'compile' ],
        options: {
          interrupt: true,
          atBegin: true,
          spawn: false,
        },
      },
    }
  } );
  grunt.loadNpmTasks( 'grunt-contrib-coffee' );
  grunt.loadNpmTasks( 'grunt-contrib-watch' );
  grunt.loadNpmTasks( 'grunt-web-server' );
  //grunt.loadNpmTasks( 'grunt-http-server' );
  // Default task(s).
  grunt.registerTask( 'default', [ 'watch:coffeechanges' ] );
  grunt.registerTask( 'serve', [ 'web_server' ] );
  grunt.registerTask( 'compile', [ 'coffee:compile' ] );
};