"use strict";
var Ember = require("ember")["default"] || require("ember");
var I18n = require("./i18n-js")["default"] || require("./i18n-js");var translate = require("./translate")["default"] || require("./translate");
var localize = require("./localize")["default"] || require("./localize");

/**
 * Registers in handlebars helpers for translate and localize.
 * @param  {object} options Options for customize the names of the helpers.
 *                          Defaults to { translate: "translate", localize: localize }
 *
 * Example usage:
 *
 * registerHelpers({translate: 'i18n-t', localize: 'i18n-l'});
 *
 */
function registerHelpers(options){
  options = options || {};
  options.translate = "translate";
  options.localize  = "localize";

  Ember.Handlebars.registerBoundHelper(options.translate, translate);
  Ember.Handlebars.registerBoundHelper(options.localize, localize);
}

/**
 * Private
 * Fetches the translations from the given url and loads it into I18n.
 * If a callback is provided, it is executed afterwards.
 * @param  {String}   localeName The name of the locale.
 * @param  {String}   url        The url from where to fetch the translations json.
 * @param  {Function} callback   (Optional) A callback function to execute on success.
 */
function loadTranslations(localeName, url, callback){
  var json;

  if (arguments.length == 2){
    json = arguments[1];
    I18n.translations[localeName] = json;

  } else {
    var httpRequest = new XMLHttpRequest();

    httpRequest.onload = function (data) {
      json = JSON.parse(data.currentTarget.responseText);
      I18n.translations[localeName] = json;
      callback && callback(json);
    }
    httpRequest.open('GET', url)
    httpRequest.send();
  }
}


function SimpleI18n(){
  this.I18n = I18n;

  this.setDefaultLocale = function(localeName, url, callback){
    this.I18n.defaultLocale = localeName;
    loadTranslations.apply(null, arguments);
  };

  this.setLocale = function(localeName, url, callback){
    this.I18n.locale = localeName;
    loadTranslations.apply(null, arguments);
  };

  this.setFallbacks = function(value){
    this.I18n.fallbacks = value;
  }

  return this;
}

var simpleI18n = new SimpleI18n();

exports.simpleI18n = simpleI18n;
exports.registerHelpers = registerHelpers;
exports.translate = translate;
exports.localize = localize;