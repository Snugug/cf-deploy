'use strict';

module.exports = function (cfBlob) {
  return cfBlob.cf.apps.create(cfBlob.auth.token_type, cfBlob.auth.access_token, {
    'name': cfBlob.config.app,
    'space_guid': cfBlob.app.space,
    'buildpack': cfBlob.app.buildpack
  });
};