define(
  ["ember","./i18n-js","./translate","./localize","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;
    var I18n = __dependency2__["default"] || __dependency2__;var translate = __dependency3__["default"] || __dependency3__;
    var localize = __dependency4__["default"] || __dependency4__;

    function registerHelpers(options){
      options = options || {};
      options.translate = "translate";
      options.localize  = "localize";

      Ember.Handlebars.registerBoundHelper(options.translate, translate);
      Ember.Handlebars.registerBoundHelper(options.localize, localize);
    }

    __exports__.I18n = I18n;
    __exports__.registerHelpers = registerHelpers;
    __exports__.translate = translate;
    __exports__.localize = localize;
  });