'use strict';

var Promise = require('bluebird'),
    apps = require('cf-nodejs-client'),
    yaml = require('js-yaml'),
    merge = require('deepmerge'),
    util = require('util'),
    config = require('../config.json'),
    path = require('path'),
    fs = require('fs');

var buildManifest;

var localManifest = function () {
  return new Promise(function (resolve, reject) {
    var manifestFile = path.join(process.cwd(), 'manifest.yml');
    try {
      manifestFile = fs.readFileSync(manifestFile, 'utf-8');
    }
    catch (e) {
      manifestFile = '';
    }

    try {
      manifestFile = yaml.safeLoad(manifestFile);
    }
    catch (e) {
      reject(e);
    }

    if (manifestFile) {
      resolve(manifestFile);
    }
    else {
      resolve({});
    }
  });
}

var serverManifest = function (auth, guid) {
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

    return manifest;
  });
}

apps = new apps.Apps();
apps.setEndPoint(config.endpoint);

buildManifest = function (auth, guid) {
  return localManifest().then(function (localM) {
    if (guid) {
      return serverManifest(auth, guid).then(function (serverM) {
        var manifest = merge(serverM, localM);
        return manifest;
      });
    }
    else {
      return localM;
    }
  });
}

module.exports = buildManifest;