'use strict';

module.exports = function (zip, cfBlob) {
  return cfBlob.cf.apps.uploadApp(cfBlob.auth.auth_token, cfBlob.auth.access_token, cfBlob.app.guid, zip);
}