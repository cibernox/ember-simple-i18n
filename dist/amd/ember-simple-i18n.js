define(
  ["./i18n-js","./translate-helper","./localize-helper","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var I18n = __dependency1__["default"] || __dependency1__;var translateHelper = __dependency2__["default"] || __dependency2__;
    var localizeHelper = __dependency3__["default"] || __dependency3__;

    /**
     * Wraps I18n translate method.
     * @param  {String} scope   The scope to translate. Forwarded to I18n-js.
     * @param  {Object} options The options of the translations. Forwarded to I18n-js.
     * @return {String}         The translated string.
     */
    function translate(scope, options){
      return I18n.t(scope, options)
    }

    /**
     * Wraps I18n localize method.
     * @param  {String} scope The scope of the localization. Forwarded to I18n-js.
     * @param  {Mixed} value  The value to localize.
     * @return {String}       The localized value.
     */
    function localize(scope, value){
      return I18n.l(scope, value)
    }

    /* Aliases */
    var t = translate;
    var l = localize;

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

      Ember.Handlebars.registerBoundHelper(options.translate, translateHelper);
      Ember.Handlebars.registerBoundHelper(options.localize, localizeHelper);
    }

    /**
     * Private
     * Fetches the translations from the given url and loads it into I18n.
     * If a callback is provided, it is executed afterwards.
     * @param  {String}   localeName The name of the locale.
     * @param  {String}   urlOrJSON  The url from where to fetch the translations json.
     */
    function loadTranslations(localeName, urlOrJSON){
      return new Ember.RSVP.Promise(function(resolve, reject){
        if (typeof urlOrJSON === 'object'){
          I18n.translations[localeName] = urlOrJSON;
          resolve(urlOrJSON);
        } else {
          Ember.$.ajax({url: urlOrJSON, dataType: 'json'}).success(function (json) {
            I18n.translations[localeName] = json;
            resolve(json);
          }).fail(reject);
        }
      });
    };

    function setDefaultLocale(localeName, url, callback){
      I18n.defaultLocale = localeName;
      return loadTranslations.apply(null, arguments);
    };

    function setLocale(localeName, url, callback){
      I18n.locale = localeName;
      return loadTranslations.apply(null, arguments);
    };

    function setFallbacks(value){
      I18n.fallbacks = value;
    }

    function getDefaultLocale(){
      return I18n.defaultLocale;
    };

    function getLocale(){
      return I18n.locale;
    };

    function getFallbacks(){
      return I18n.fallbacks;
    }

    function getTranslations(){
      return I18n.translations;
    }

    __exports__.setDefaultLocale = setDefaultLocale;
    __exports__.setLocale = setLocale;
    __exports__.setFallbacks = setFallbacks;
    __exports__.getDefaultLocale = getDefaultLocale;
    __exports__.getLocale = getLocale;
    __exports__.getFallbacks = getFallbacks;
    __exports__.getTranslations = getTranslations;
    __exports__.registerHelpers = registerHelpers;
    __exports__.translateHelper = translateHelper;
    __exports__.localizeHelper = localizeHelper;
    __exports__.translate = translate;
    __exports__.t = t;
    __exports__.localize = localize;
    __exports__.l = l;
  });