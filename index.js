'use strict';

var Promise = require('bluebird'),
    util = require('util'),
    Spinner = require('cli-spinner').Spinner,
    spinner = new Spinner('%s'),
    manifest = require('./lib/manifest'),
    create = require('./lib/create'),
    blob = require('./lib/cfblob'),
    zip = require('./lib/zip'),
    upload = require('./lib/upload'),
    clean = require('./lib/clean');


module.exports = function (options) {
  spinner.start();

  return blob(options).then(function (cfBlob) {
    return zip().then(function (file) {
      return upload(file, cfBlob).then(function (result) {
        console.log(result);

        return clean(file).then(function () {
          spinner.stop();
          console.log(file);
        });
      });
    });
  //   spinner.stop();
  //   console.log(cfBlob.app);
  //   // return create(cfBlob).then(function (app) {
  //   //   spinner.stop();
  //   //   console.log(app);
  //   // });
  //   // return manifest(cfBlob).then(function (settings) {
  //   //   spinner.stop();
  //   //   // console.log(settings);

    // });
  }).catch(function (error) {
    spinner.stop(true);
    console.error('Error: ' + error);
    process.exit(1);
  });
}

