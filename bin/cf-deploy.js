#!/usr/bin/env node
'use strict';

var program = require('commander'),
    path = require('path'),
    meta = require('../package.json'),
    cfd = require('../index');

var options = {};

program
  .usage('<method> [options]')
  .arguments('<method>')
  .action(function (method) {
    options.method = method;
  })
  .option('-c, --config <path>', 'path to custom config file')
  .option('-e, --endpoint <endpoint>', 'API Endpoint to use')
  .option('-u, --username <username>', 'username')
  .option('-p, --password <password>', 'password')
  .option('-n, --app <app>', 'name of application')
  .option('-s, --space <space>', 'space to deploy to')
  .option('-o, --org <org>', 'organization to deploy to')
  .option('-h, --host <host>', 'custom host to use')

program.on('--help', function(){
  console.log('  Deploy Methods:');
  console.log('');
  console.log('    $ cf-deploy blue-green  Blue/Green Deploy');
  console.log('    $ cf-deploy branch      Branch Deploy');
  console.log('');
});

program.parse(process.argv);

if (typeof options.method === 'undefined') {
  console.error('No command given!');
  process.exit(1);
}
else if (options.method !== 'blue-green' && options.method !== 'branch') {
  console.error('Only `blue-green` and `branch` deploys are supported');
  process.exit(1);
}

program.options.forEach(function (option) {
  var name = option.long.substr(2);
  if (name !== 'config') {
    if (program[name]) {
      options[name] = program[name];
    }
  }
});

cfd(options);