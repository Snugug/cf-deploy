'use strict';

var Promise = require('bluebird'),
    configure = require('./config'),
    authorize = require('./auth'),
    ensure = require('./ensure');

module.exports = function (options) {
  var blob = {};

  return new Promise(function (resolve, reject) {
    return configure(options).then(function (config) {
      blob.config = config;
      blob.cf = require('./cf')(config);

      return authorize(blob).then(function (auth) {
        blob.auth = auth;

        return ensure(blob).then(function (cfBlob) {
          resolve(cfBlob);
        });
      });
    }).catch(function (error) {
      reject(error);
    })
  });
}