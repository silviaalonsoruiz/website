module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    encoding: 'utf-8',

    pkg: grunt.file.readJSON('package.json'),

    // Project settings
    app: {
      src: require('./bower.json').srcPath || 'src',
      dist: 'dist'
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json']
      },
      scripts: {
        files: ['<%= app.src %>/scripts/**/*.js'],
        tasks: []
      },
      tests: {
        files: ['test/specs/*.js'],
        tasks: ['karma']
      },
      sass: {
        files: ['<%= app.src %>/styles/**/*.scss'],
        tasks: ['sass']
      },
      styles: {
        files: ['<%= app.src %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles']
      },
      html: {
        files: [
          '<%= app.src %>/htmls/**/*.html',
          '<%= app.src %>/scripts/templates/*.html'
        ]
      },
      gruntfile: {
        files: ['Gruntfile.js']
      }
    },

    // The actual grunt server settings
    connect: {
      server: {
        options: {
          port: 9000,
          hostname: '127.0.0.1',
          debug: true,
          base: [
            'bower_components',
            'dist',
            'src/htmls'
          ]
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= app.dist %>/{,*/}*',
            '!<%= app.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    copy: {
      'json-mock': {
        files: [{
          expand: true,
          flatten: true,
          src: '<%= app.src %>/sample.json',
          dest: '<%= app.dist %>'
        }]
      }
    },

    // unit tests
    karma: {
      test: {
        configFile: 'karma.conf.js'
      }
    },

    // file merging
    concat: {
      'angular-scripts': {
        options: {
          separator: ''
        },
        files: {
          '<%= app.dist %>/scripts/crs-full-build.js': ['<%= app.dist %>/scripts/**/*.js']
        }
      }
    },

    // javascript compression
    uglify: {
      'angular-scripts': {
        options: {
          compress: true,
          mangle: true
        },
        files: [{
          expand: true,
          cwd: '<%= app.src %>/scripts',
          src: ['**/*.js'],
          dest: '<%= app.dist %>/scripts'
        }]
      }
    },

    // .html files minification
    htmlmin: {
      'angular-templates': {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [{
          expand: true,
          cwd: '<%= app.src %>/scripts/templates',
          src: ['*.html'],
          dest: '<%= app.dist %>/scripts/templates'
        }]
      }
    },

    // sass (.scss) files compilation
    sass: {
      dist: {
        options: {
          loadPath: ["bower_components"]
        },
        files: [{
          expand: true,
          cwd: '<%= app.src %>/styles/entryPoints',
          src: ['**/*.scss'],
          dest: 'dist/styles',
          ext: '.css'
        }]
      }
    },

    // css minification
    cssmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= app.dist %>/styles',
          dest: '<%= app.dist %>/styles',
          src: ['**/*.css']
        }]
      }
    }
  });

  grunt.registerTask('serve', 'Compile then start a connect web server', function() {
    grunt.task.run([
      'build',
      'connect',
      'watch'
    ]);
  });

  grunt.registerTask('build', [
    'clean',
    'sass:dist',
    'cssmin:dist',
    'htmlmin:angular-templates',
    'uglify:angular-scripts',
    'concat:angular-scripts',
    'copy:json-mock'
  ]);
};
