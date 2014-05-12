var mergeTrees  = require('broccoli-merge-trees');
var pickFiles   = require('broccoli-static-compiler');
var makeModules = require('broccoli-dist-es6-module');

var simpleEmberI18n = makeModules('packages/es6', {
  global: 'Ember.SimpleI18n',
  packageName: 'simple-ember-i18n',
  main: 'main',
  shim: {
    'ember': 'Ember'
  }
})

module.exports = simpleEmberI18n;
