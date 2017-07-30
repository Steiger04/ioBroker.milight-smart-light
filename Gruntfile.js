// To use this file in WebStorm, right click on the file name in the Project Panel (normally left) and select "Open Grunt Console"

/** @namespace __dirname */
/* jshint -W097 */// jshint strict:false
/*jslint node: true */
'use strict';

module.exports = function (grunt) {

  //noinspection ES6ConvertVarToLetConst
  var srcDir = __dirname + '/';
  var pkg = grunt.file.readJSON('package.json');
  var adaptName = pkg.name.substring('iobroker.'.length);
  var iopackage = grunt.file.readJSON('io-package.json');
  var version = (pkg && pkg.version) ? pkg.version : iopackage.common.version;
  var newname = grunt.option('name');
  var author = grunt.option('author') || 'carsten04';
  var email = grunt.option('email') || 'email@mail.com';
  var fs = require('fs');

  // check arguments
  //noinspection EqualityComparisonWithCoercionJS
  if (process.argv[2] == 'rename') {
    console.log('Try to rename to "' + newname + '"');

    if (!newname) {
      console.log('Please write the new milight-smart-light name, like: "grunt rename --name=mywidgetset" --author="Author Name"');
      process.exit();
    }
    if (newname.indexOf(' ') != -1) {
      console.log('Name may not have space in it.');
      process.exit();
    }
    if (newname.toLowerCase() != newname) {
      console.log('Name must be lower case.');
      process.exit();
    }
    if (fs.existsSync(__dirname + '/admin/milight-smart-light.png')) {
      fs.renameSync(__dirname + '/admin/milight-smart-light.png', __dirname + '/admin/' + newname + '.png');
    }
    if (fs.existsSync(__dirname + '/widgets/milight-smart-light.html')) {
      fs.renameSync(__dirname + '/widgets/milight-smart-light.html', __dirname + '/widgets/' + newname + '.html');
    }
    if (fs.existsSync(__dirname + '/widgets/milight-smart-light/js/milight-smart-light.js')) {
      fs.renameSync(__dirname + '/widgets/milight-smart-light/js/milight-smart-light.js', __dirname + '/widgets/milight-smart-light/js/' + newname + '.js');
    }
    if (fs.existsSync(__dirname + '/widgets/milight-smart-light')) {
      fs.renameSync(__dirname + '/widgets/milight-smart-light', __dirname + '/widgets/' + newname);
    }
  }

  // Project configuration.
  grunt.initConfig({
    pkg: pkg,

    replace: {
      version: {
        options: {
          patterns: [
            {
              match: /version: *"[\.0-9]*"/, replacement: 'version: "' + version + '"',
            }, {
              match: /"version": *"[\.0-9]*",/g, replacement: '"version": "' + version + '",',
            }, {
              match: /version: *"[\.0-9]*",/g, replacement: 'version: "' + version + '",',
            }],
        }, files: [
          {
            expand: true, flatten: true, src: [
            srcDir + 'package.json', srcDir + 'io-package.json'], dest: srcDir,
          }, {
            expand: true, flatten: true, src: [
              srcDir + 'widgets/' + adaptName + '.html'], dest: srcDir + 'widgets',
          }, {
            expand: true, flatten: true, src: [
              srcDir + 'widgets/' + adaptName + '/js/' + adaptName + '.js'], dest: srcDir + 'widgets/' + adaptName + '/js/',
          }],
      }, name: {
        options: {
          patterns: [
            {
              match: /milight-smart-light/g, replacement: newname,
            }, {
              match: /Milight-smart-light/g, replacement: newname ? (newname[0].toUpperCase() + newname.substring(1)) : 'Milight-smart-light',
            }, {
              match: /carsten04/g, replacement: author,
            }, {
              match: /email@mail.com/g, replacement: email,
            }],
        }, files: [
          {
            expand: true, flatten: true, src: [
            srcDir + 'io-package.json', srcDir + 'LICENSE', srcDir + 'package.json', srcDir + 'README.md', srcDir + 'main.js', srcDir + 'Gruntfile.js'], dest: srcDir,
          }, {
            expand: true, flatten: true, src: [
              srcDir + 'widgets/' + newname + '.html'], dest: srcDir + 'widgets',
          }, {
            expand: true, flatten: true, src: [
              srcDir + 'admin/index.html'], dest: srcDir + 'admin',
          }, {
            expand: true, flatten: true, src: [
              srcDir + 'widgets/' + newname + '/js/' + newname + '.js'], dest: srcDir + 'widgets/' + newname + '/js',
          }, {
            expand: true, flatten: true, src: [
              srcDir + 'widgets/' + newname + '/css/*.css'], dest: srcDir + 'widgets/' + newname + '/css',
          }],
      },
    }, // Javascript code styler

    http: {
      get_hjscs: {
        options: {
          url: 'https://raw.githubusercontent.com/ioBroker/ioBroker.js-controller/master/tasks/jscs.js',
        },
        dest: 'tasks/jscs.js',
      },
      get_jshint: {
        options: {
          url: 'https://raw.githubusercontent.com/ioBroker/ioBroker.js-controller/master/tasks/jshint.js',
        },
        dest: 'tasks/jshint.js',
      },
      get_jscsRules: {
        options: {
          url: 'https://raw.githubusercontent.com/ioBroker/ioBroker.js-controller/master/tasks/jscsRules.js',
        },
        dest: 'tasks/jscsRules.js',
      },
    },

    jscs: require(__dirname + '/tasks/jscs.js'), // Lint

    jshint: require(__dirname + '/tasks/jshint.js'),


    /*********************************************************************************/

    watch: {
      options: {
        livereload: true,
      },
      admin: {
        files: 'admin/**',
        tasks: ['run-cmd:../..:iobroker:upload,milight-smart-light'],
      },
      iopackage: {
        files: 'io-package.json',
        tasks: ['run-cmd:../..:iobroker:upload,milight-smart-light'],
      }
    },

    bower: {
      prod: {
        dest: 'admin/lib/',
        js_dest: 'admin/lib/js/',
        css_dest: 'admin/lib/css/',
        images_dest: 'admin/lib/images/',

        options: {
          keepExpandedHierarchy: false,

          packageSpecific:{
            pure:{
              files:[
                "pure-min.css",
                "grids-responsive-min.css"
              ]
            }
          }
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-http');

  grunt.registerTask('default', [
    'http', 'replace:version', 'jshint', 'jscs']);

  grunt.registerTask('prepublish', [
    'http', 'replace:version']);

  grunt.registerTask('p', [
    'http', 'replace:version']);

  grunt.registerTask('rename', [
    'replace:name']);

  /**********************************************************************************************************/

  require('time-grunt')(grunt);
  require('grunt-run-cmd')(grunt);

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bower');

  grunt.registerTask('update admin', 'Lade die geänderten admin-Dialogdateien nach iobroker-data ...', ['watch']);
};
