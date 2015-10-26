'use strict';

var CloudFoundry = require('cf-nodejs-client'),
    Promise = require('bluebird'),
    util = require('util'),
    Spinner = require('cli-spinner').Spinner,
    spinner = new Spinner('%s'),
    cf = new CloudFoundry.CloudFoundry(),
    routes = new CloudFoundry.Routes(),
    manifest = require('./lib/manifest'),
    config = require('./lib/config'),
    apps = new CloudFoundry.Apps();

module.exports = function (options) {
  spinner.start();

  config(options).then(function (config) {
    cf.setEndPoint(config.endpoint);
    routes.setEndPoint(config.endpoint);
    apps.setEndPoint(config.endpoint);

    return cf.getInfo().then(function (result) {
      return cf.login(result.authorization_endpoint,
        config.username,
        config.password);
    }).then(function (auth) {
      return apps.getApps(auth.token_type, auth.access_token).then(function (result) {
        var guid;

        result.resources.forEach(function (item) {
	  if (item.entity.name === config.app) {
            guid = item.metadata.guid;
          }
        });

	return manifest(auth, guid).then(function (settings) {
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

