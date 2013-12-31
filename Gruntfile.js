'use strict';

module.exports = function (grunt) {
  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.initConfig({
    directory_to_json: {
      development: {
        root_directory: '',
        dest: 'test/dest/dir.json',
        src: ['test/**/*']
      }
    },
    jshint: {
      options: {
        'jshintrc': '.jshintrc',
        'reporter': 'jslint',
        'reporterOutput': 'jslint.xml',
        'force': true
      },
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ]
    },
    mochaTest: {
      options: {
          reporter: 'xunit',
          captureFile: 'tests.xml'
      },
      files: ['test/*_test.js']
    },
    clean: {
      files: 'test/dest'
    }
  });

  grunt.registerTask('test', [
    'clean',
    'directory_to_json',
    'jshint',
    //'mochaTest',
  ]);

  grunt.registerTask('default', 'test');
};
