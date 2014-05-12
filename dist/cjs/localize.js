"use strict";
var I18n = require("./i18n-js")["default"] || require("./i18n-js");

exports["default"] = function(format, value) {
  return I18n.l(format, value);
}