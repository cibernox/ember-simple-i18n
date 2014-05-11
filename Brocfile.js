var mergeTrees  = require('broccoli-merge-trees');
var pickFiles   = require('broccoli-static-compiler');
var compileES6  = require('broccoli-es6-concatenator');
var validateES6 = require('broccoli-es6-import-validate');

var packages = 'packages';

var i18n = pickFiles('vendor', {
  srcDir: '/',
  files: ['i18n-js/*.js'],
  destDir: '/'
});

var sourceTrees = mergeTrees([packages, i18n])

var simpleEmberI18n = compileES6(sourceTrees, {
  loaderFile: '/loader.js',
  wrapInEval: false,
  inputFiles: ['es6/*.js'],
  legacyFilesToAppend: ['i18n-js/i18n.js'],
  outputFile: '/simple-ember-i18n.js'
});

module.exports = simpleEmberI18n;
