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
    var rootDirectory = (this.data.root_directory !== undefined)? this.data.root_directory : '',
      sort_by = (this.data.sort_by !== undefined) ? this.data.sort_by : false,
      sort_dir = (this.data.sort_dir !== undefined) ? this.data.sort_dir : 'asc',      
      include_nonfile = (this.data.include_nonfile !== undefined) ? this.data.include_nonfile : false;


    this.files.forEach(function(fileGroup) {

      var directoryStructure = {
        files: []
      };

      fileGroup.src.forEach(function(file){
        grunt.log.writeln('Processing File "' + file + '".');
        if (include_nonfile || grunt.file.isFile(file) )
        {
          var fileStructure = {},
              filestats = fs.statSync(file);
          fileStructure.path = rootDirectory + file;
          fileStructure.title = getTitle(file);
          fileStructure.is_file = grunt.file.isFile(file);
          fileStructure.modified = filestats.mtime;
          
          directoryStructure.files.push(fileStructure);
        }
      });
      var sort_function = null;
      if (sort_by == 'date')
      {
          sort_function = function(a,b){return a.modified-b.modified};
      } else if (sort_by =='title')
      {
          sort_function = function(a,b){return a.title-b.title};  
      } else if (sort_by =='path')
      {
          sort_function = function(a,b){return a.path-b.path};  
      }

      directoryStructure.files.sort(sort_function);
      if (sort_dir =='desc')
      {
        directoryStructure.files.reverse();
      }
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
