define(
  ["ember","./translate","./localize","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;
    var translate = __dependency2__["default"] || __dependency2__;
    var localize = __dependency3__["default"] || __dependency3__;

    var defaultOptions = {translate: "translate", localize: "localize"};

    function registerHelpers(options){
      options = options || {};
      options.translate = "translate";
      options.localize  = "localize";

      Ember.Handlebars.registerBoundHelper(options.translate, translate);
      Ember.Handlebars.registerBoundHelper(options.localize, localize);
    }

    __exports__.registerHelpers = registerHelpers;
    __exports__.translate = translate;
    __exports__.localize = localize;
  });