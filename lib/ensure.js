'use strict';

var Promise = require('bluebird'),
    find = require('./find'),
    create = require('./create');

module.exports = function (cfBlob) {
  return find(cfBlob).then(function (app) {
    cfBlob.app = app;

    if (!app.hasOwnProperty('guid')) {
      return create(cfBlob).then(function (newApp) {
        cfBlob.app.guid = newApp.metadata.guid;
        cfBlob.app.buildpack = newApp.entity.buildpack;

        return cfBlob;
      });
    }
    else {
      return cfBlob;
    }
  });
}