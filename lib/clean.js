'use strict';

var Promise = require('bluebird'),
    path = require('path'),
    fs = Promise.promisifyAll(require('fs-extra'));

module.exports = function (file) {
  var dir = path.dirname(file);
  return fs.removeAsync(dir);
}