'use strict';

module.exports = function (grunt) {
  // Show elapsed time at the end
  require('time-grunt')(grunt);
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({

    bump: {
      createTag: true,
      push: true,
      pushTo: 'upstream'
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          require: 'test/coverage/blanket',
          grep: grunt.option('grep'),
          colors: true
        },
        src: ['test/**/*.js']
      },
      coverage: {
        options: {
          reporter: 'html-cov',
          quiet: true,
          captureFile: 'test/coverage/coverage.html'
        },
        src: ['test/**/*.js']
      }
    },

    jsdoc: {
      dist: {
        src: ['app/*'],
        options: {
          destination: 'docs',
          configure: 'docs/conf.json'
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        force: true,
        reporter: require('jshint-stylish')
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: ['app/*']
      }
    },

    watch: {
      server: {
        files: ['.rebooted'],
        options: {
          livereload: true
        }
      }
    },

    concurrent: {
      dev: {
        tasks: ['nodemon', 'node-inspector', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          nodeArgs: [],
          env: {
            PORT: '3000'
          },
          cwd: __dirname,
          ignore: ['node_modules/**'],
          watch: ['server', 'models'],
          ext: 'js, json, html',
          // omit this property if you aren't serving HTML files and 
          // don't want to open a browser tab on start
          callback: function (nodemon) {
            nodemon.on('log', function (event) {
              console.log(event.colour);
            });

            // opens browser on initial server start
            nodemon.on('config:update', function () {
              // Delay before server listens on port
              setTimeout(function() {
                require('open')('https://localhost:3000');
              }, 1000);
            });

            // refreshes browser when server reboots
            nodemon.on('restart', function () {
              // Delay before server listens on port
              setTimeout(function() {
                require('fs').writeFileSync('.rebooted', 'rebooted');
              }, 1000);
            });
          }
        }
      }
    },

    'node-inspector': {
      custom: {
        options: {
          'web-port': 8080,
          'web-host': '0.0.0.0',
          'debug-port': 5858,
          'save-live-edit': true,
          'no-preload': false,
          'stack-trace-limit': 50,
          'hidden': []
        }
      }
    }

  });

  // Default task.
  grunt.registerTask('default', ['jshint', 'concurrent']);

  grunt.registerTask('test', 'mochaTest');

  grunt.registerTask('docs', 'jsdoc');

};

