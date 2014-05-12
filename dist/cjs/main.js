"use strict";
var Ember = require("ember")["default"] || require("ember");
var translate = require("./translate")["default"] || require("./translate");
var localize = require("./localize")["default"] || require("./localize");

var defaultOptions = {translate: "translate", localize: "localize"};

function registerHelpers(options){
  options = options || {};
  options.translate = "translate";
  options.localize  = "localize";

  Ember.Handlebars.registerBoundHelper(options.translate, translate);
  Ember.Handlebars.registerBoundHelper(options.localize, localize);
}

exports.registerHelpers = registerHelpers;
exports.translate = translate;
exports.localize = localize;