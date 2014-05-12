var makeModules = require('broccoli-dist-es6-module');

var emberSimpleI18n = makeModules('packages/es6', {
  global: 'Ember.SimpleI18n',
  packageName: 'ember-simple-i18n',
  main: 'main',
  shim: {
    'ember': 'Ember'
  }
})

module.exports = emberSimpleI18n;
