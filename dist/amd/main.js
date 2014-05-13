define(
  ["ember","./i18n-js","./translate","./localize","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;
    var I18n = __dependency2__["default"] || __dependency2__;var translate = __dependency3__["default"] || __dependency3__;
    var localize = __dependency4__["default"] || __dependency4__;

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

    __exports__.simpleI18n = simpleI18n;
    __exports__.registerHelpers = registerHelpers;
    __exports__.translate = translate;
    __exports__.localize = localize;
  });