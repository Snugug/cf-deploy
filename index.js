'use strict';

var CloudFoundry = require('cf-nodejs-client'),
      config = require('./config.json'),
      util = require('util'),
      Spinner = require('cli-spinner').Spinner,
      spinner = new Spinner('%s'),
      cf = new CloudFoundry.CloudFoundry(),
      routes = new CloudFoundry.Routes(),
      apps = new CloudFoundry.Apps();

// console.log(CloudFoundry);

cf.setEndPoint(config.endpoint);
routes.setEndPoint(config.endpoint);
apps.setEndPoint(config.endpoint);

spinner.start();

cf.getInfo().then(function (result) {
  return cf.login(result.authorization_endpoint,
    config.username,
    config.password);
}).then(function (auth) {
  return apps.getApps(auth.token_type, auth.access_token).then(function (result) {
    var guid;


    // ha--node-starter
    result.resources.forEach(function (item) {
      if (item.entity.name === config.name) {
        guid = item.metadata.guid;
      }
    });

    if (guid) {
      return apps.getSummary(auth.token_type, auth.access_token, guid).then(function (summary) {
        var manifest = {},
            application = {};

        application = {
          'name': summary.name,
          'memory': summary.memory,
          'instances': summary.instances,
        };

        /**
          * Manifest work from:
          * https://github.com/cloudfoundry/cli/blob/d6c2531718002c2074a6c1e557d34de16e47f7a8/cf/commands/create_app_manifest.go#L89-L146
        **/

        //////////////////////////////
        // Add Buildpack
        //////////////////////////////
        if (summary.buildpack && summary.buildpack !== '') {
          application.buildpack = summary.buildpack;
        }

        //////////////////////////////
        // Add Command
        //////////////////////////////
        if (summary.command && summary.command !== '') {
          application.command = summary.command;
        }

        //////////////////////////////
        // Add Hosts and Domains
        //////////////////////////////
        if (summary.routes.length > 0) {
          if (summary.routes.length === 1) {
            application.host = summary.routes[0].host;
            application.domain = summary.routes[0].domain.name;
          }
          else {
            application.hosts = [];
            application.domains = [];

            summary.routes.forEach(function (route) {
              application.hosts.push(route.host);
              application.domains.push(route.domain.name);
            });
          }
        }

        //////////////////////////////
        // Add the Services
        //////////////////////////////
        if (summary.services.length > 0) {
          application.services = [];
          summary.services.forEach(function (service) {
            application.services.push(service.name);
          });
        }

        //////////////////////////////
        // Add Environment Variables
        //////////////////////////////
        if (Object.keys(summary.environment_json).length > 0) {
          application.env = summary.environment_json;
        }

        //////////////////////////////
        // Add Health Check Timeout
        //////////////////////////////
        if (summary.health_check_timeout > 0) {
          application.timeout = sumary.health_check_timeout;
        }


        //////////////////////////////
        // Build the Manifest
        //////////////////////////////
        manifest.applications = [];
        manifest.applications.push(application);



        spinner.stop(true);
        // console.log(util.inspect(summary, true, null));
        console.log(util.inspect(manifest, true, null));
      });
    }
  });
}).catch(function (error) {
  spinner.stop(true);
  console.error("Error:" + error);
});