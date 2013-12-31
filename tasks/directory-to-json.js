/*
 * grunt-directory-to-json
 * https://github.com/andrewcouch/grunt-directory-to-json
 *
 * Copyright (c) 2014 Andrew Couch
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs'),
    path = require('path');

module.exports = function(grunt) {

  grunt.registerMultiTask('directory_to_json', 'Generate a JSON file to reflect the directory structure', function() {
    var rootDirectory = (this.data.root_directory !== undefined)? this.data.root_directory : '';

    this.files.forEach(function(fileGroup) {

      var directoryStructure = {
        files: []
      };

      fileGroup.src.forEach(function(file){
        grunt.log.writeln('Processing File "' + file + '".');
        var fileStructure = {},
            filestats = fs.statSync(file);
        fileStructure.path = rootDirectory + file;
        fileStructure.title = getTitle(file);
        fileStructure.is_file = grunt.file.isFile(file);
        fileStructure.modified = filestats.mtime;
        
        directoryStructure.files.push(fileStructure);
      });

      grunt.file.write(fileGroup.dest, JSON.stringify(directoryStructure, null, '\t'));

      grunt.log.writeln('File "' + fileGroup.dest + '" created.');
    });
  });

  function getTitle(fullPath) {
    var filepath = path.dirname(fullPath);
    if (!grunt.file.isFile(fullPath))
    {
      return filepath;
    }
    var type = path.extname(fullPath),
        filename = path.basename(fullPath, type),
        fileContents = grunt.file.read(fullPath),
        title = null;
    
    if (type == '.html')
    {
      title = fileContents.match(/<title>(.*)<\/title>/i);
      if (title === null)
      {
        //Perhaps it is a swig template masquarading as an .html
        type = '.swig';  
      }

    }
    if (type == '.swig')
    {
      title = fileContents.match(/{% block title %}(.*){% endblock %}/i);
    }
    if (title === null)
    {
      title = filename;
    }else {
      title = title[1];
    }
    return title;
  }
};
