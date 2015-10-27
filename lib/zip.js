'use strict';

var Promise = require('bluebird'),
    fs = require('fs'),
    ini = require('gitignore-parser'),
    path = require('path'),
    AdmZip = require('adm-zip'),
    glob = require('glob');

module.exports = function () {
  return new Promise(function (resolve, reject) {
    var ignore,
        ignorePath = path.join(process.cwd(), '.cfignore'),
        ignoreFile = '';



    try {
      ignoreFile = fs.readFileSync(ignorePath, 'utf-8');
    }
    catch (e) {
      // Nothing to do here.
    }

    if (ignoreFile !== ignorePath) {
      try {
        ignore = ini.compile(ignoreFile);
      }
      catch (e) {
        reject(e);
      }
    }

    glob(path.join('**/*'), function (err, files) {
      var zip = new AdmZip(),
          zipPath = path.join(process.cwd(), new Date().valueOf() + '.zip');

      if (err) {
        reject(err);
      }

      files = files.filter(ignore.accepts);

      files.forEach(function (file) {
        zip.addLocalFile(path.join(process.cwd(), file));
      });

      zip.writeZip(zipPath);

      resolve(zipPath);
    });
  });
}