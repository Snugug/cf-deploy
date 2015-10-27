'use strict';

module.exports = function (cfBlob) {
  return cfBlob.cf.cloudFoundry.getInfo().then(function (result) {
    return cfBlob.cf.cloudFoundry.login(result.authorization_endpoint,
      cfBlob.config.username,
      cfBlob.config.password);
  });
}