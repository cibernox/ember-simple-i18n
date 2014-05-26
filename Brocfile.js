var makeModules = require('broccoli-dist-es6-module');

var emberSimpleI18n = makeModules('src', {
  global: 'Ember.SimpleI18n',
  packageName: 'ember-simple-i18n',
  main: 'ember-simple-i18n',
  shim: {
    'ember': 'Ember'
  }
})

module.exports = emberSimpleI18n;
