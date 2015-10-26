'use strict';

var CloudFoundry = require('cf-nodejs-client'),
    _ = require('lodash-node/compat/string/camelCase');

module.exports = function (config) {
  var models = {};

  Object.keys(CloudFoundry).forEach(function (model) {
    var m;

    if (model !== 'version') {
      m = new CloudFoundry[model]();
      if (m.setEndPoint) {
        m.setEndPoint(config.endpoint);
      }

      models[_(model)] = m;
    }

  });

  return models;
}