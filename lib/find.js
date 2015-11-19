'use strict';

var Promies = require('bluebird');

module.exports = function (cfBlob) {
  var app = {};

  return cfBlob.cf.spaces.getSpaces(cfBlob.auth.token_type, cfBlob.auth.access_token).then(function (spaces) {
    // Loop over spaces
    spaces.resources.forEach(function (space) {
      if (space.entity.name === cfBlob.config.space) {
        app.space = space.metadata.guid;
      }
    });

    if (Object.keys(app).length === 0) {
      throw new Error('App space ' + cfBlob.config.space + ' not found');
    }
    else {
      return cfBlob.cf.spaces.getSpaceApps(cfBlob.auth.token_type, cfBlob.auth.access_token, app.space).then(function (apps) {
        console.log(cfBlob.config)
        // Loop over apps
        apps.resources.forEach(function (spaceApp) {
          if (spaceApp.entity.name === cfBlob.config.app) {
            app.guid = spaceApp.metadata.guid;
            app.buildpack = spaceApp.entity.buildpack;
          }
        });

        return app;
      })
    }
  });
};