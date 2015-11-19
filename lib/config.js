'use strict';

var Promise = require('bluebird');

module.exports = function (options) {
  return new Promise(function (resolve, reject) {
    if (!options) {
      options = {};
    }

    // Endpoint
    if (!options.endpoint) {
      if (process.env.CF_ENDPOINT) {
        options.endpoint = process.env.CF_ENDPOINT;
      }
      else {
        reject('API Endpoint Required');
      }
    }

    // Username
    if (!options.username) {
      if (process.env.CF_USER) {
        options.username = process.env.CF_USER;
      }
      else {
        reject('Username Required');
      }
    }

    // Password
    if (!options.password) {
      if (process.env.CF_PASSWORD) {
        options.password = process.env.CF_PASSWORD;
      }
      else {
        reject('Password Required');
      }
    }

    // App Name
    if (!options.app) {
      if (process.env.CF_APP) {
        options.app = process.env.CF_APP;
      }
      else {
        reject('App Name Required');
      }
    }

    // App Space
    if (!options.space) {
      if (process.env.CF_SPACE) {
        options.space = process.env.CF_SPACE;
      }
      else {
        reject('Space Required');
      }
    }

    // App Org
    if (!options.org) {
      if (process.env.CF_ORG) {
        options.org = process.env.CF_ORG;
      }
    }

    // Host Name
    if (!options.host) {
      if (process.env.CF_HOST) {
        options.host = process.env.CF_HOST;
      }
      else if (options.method === 'branch') {
        // Custom Host Name based off of repo for branch builds
        if (process.env.TRAVIS_REPO_SLUG) {
          options.host = process.env.TRAVIS_REPO_SLUG.replace(/\//g, '--') + '__';
          if (process.env.TRAVIS_PULL_REQUEST === false) {
            options.host += process.env.TRAVIS_BRANCH.replace(/\//g, '-');
          }
          else {
            options.host += 'pr-' + process.env.TRAVIS_PULL_REQUEST;
          }

        }
      }
    }


    resolve(options);
  });
}