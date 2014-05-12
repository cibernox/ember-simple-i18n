"use strict";
// Ember.Handlebars.registerBoundHelper('l',
exports["default"] = function(format, value) {
  return I18n.l(format, value);
}