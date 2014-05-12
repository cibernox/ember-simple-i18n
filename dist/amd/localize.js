define(
  ["exports"],
  function(__exports__) {
    "use strict";
    // Ember.Handlebars.registerBoundHelper('l',
    __exports__["default"] = function(format, value) {
      return I18n.l(format, value);
    }
  });