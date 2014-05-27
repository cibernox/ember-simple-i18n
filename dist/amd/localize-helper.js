define(
  ["./i18n-js","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var I18n = __dependency1__["default"] || __dependency1__;

    __exports__["default"] = function(format, value) {
      return I18n.l(format, value);
    }
  });