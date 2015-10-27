'use strict';

var Promies = require('bluebird');

module.exports = function (cfBlob) {
  return cfBlob.cf.apps.getApps(cfBlob.auth.token_type, cfBlob.auth.access_token).then(function (result) {
    var app = {};

    result.resources.forEach(function (item) {
      if (item.entity.name === cfBlob.config.app) {
        // console.log(item);
        app.guid = item.metadata.guid;
        app.space = item.entity.space_guid;
        app.buildpack = item.entity.buildpack;
      }
    });

    if (Object.keys(app).length === 0) {
      if (cfBlob.config.space) {
        return cfBlob.cf.spaces.getSpaces(cfBlob.auth.token_type, cfBlob.auth.access_token).then(function (result) {

          result.resources.forEach(function (item) {
            if (item.entity.name === cfBlob.config.space) {
              app.space = item.metadata.guid;
            }
          });

          if (Object.keys(app).length === 0) {
            throw new Error('Space ' + cfBlob.config.space + ' not found');
          }

          return app;
        });
      }
      else {
        throw new Error('App Space is required for creating new projects');
      }
    }
    else {
      return app;
    }
  });
}