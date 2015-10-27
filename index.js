'use strict';

var Promise = require('bluebird'),
    util = require('util'),
    Spinner = require('cli-spinner').Spinner,
    spinner = new Spinner('%s'),
    manifest = require('./lib/manifest'),
    create = require('./lib/create'),
    blob = require('./lib/cfblob');

module.exports = function (options) {
  spinner.start();

  return blob(options).then(function (cfBlob) {
    spinner.stop();
    console.log(cfBlob.app);
    // return create(cfBlob).then(function (app) {
    //   spinner.stop();
    //   console.log(app);
    // });
    // return manifest(cfBlob).then(function (settings) {
    //   spinner.stop();
    //   // console.log(settings);

    // });
  }).catch(function (error) {
    spinner.stop(true);
    console.error('Error: ' + error);
    process.exit(1);
  });
}

