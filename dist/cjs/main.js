"use strict";
var Ember = require("ember")["default"] || require("ember");
var I18n = require("./i18n-js")["default"] || require("./i18n-js");var translate = require("./translate")["default"] || require("./translate");
var localize = require("./localize")["default"] || require("./localize");

function registerHelpers(options){
  options = options || {};
  options.translate = "translate";
  options.localize  = "localize";

  Ember.Handlebars.registerBoundHelper(options.translate, translate);
  Ember.Handlebars.registerBoundHelper(options.localize, localize);
}

function SimpleI18n(){
  this.I18n = I18n;
  this.loadTranslations = function(localeName, url){
    debugger;
  }
}

exports.SimpleI18n = SimpleI18n;
exports.registerHelpers = registerHelpers;
exports.translate = translate;
exports.localize = localize;