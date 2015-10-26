'use strict';

var Promise = require('bluebird'),
    util = require('util'),
    Spinner = require('cli-spinner').Spinner,
    spinner = new Spinner('%s'),
    manifest = require('./lib/manifest'),
    config = require('./lib/config'),
    cf = require('./lib/cf');

module.exports = function (options) {
  spinner.start();

  config(options).then(function (config) {
    cf = cf(config);

    return cf.cloudFoundry.getInfo().then(function (result) {
      return cf.cloudFoundry.login(result.authorization_endpoint,
        config.username,
        config.password);
    }).then(function (auth) {
      return cf.apps.getApps(auth.token_type, auth.access_token).then(function (result) {
        var guid;

        result.resources.forEach(function (item) {
          if (item.entity.name === config.app) {
            guid = item.metadata.guid;
          }
        });

        return manifest(auth, guid, cf).then(function (settings) {
          spinner.stop();
          console.log(settings);
          return settings;
        });
      });
    })
  }).catch(function (error) {
    spinner.stop(true);
    console.error('Error: ' + error);
    process.exit(1);
  });
}

