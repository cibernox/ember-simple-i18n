define(
  ["ember","./i18n-js","./translate","./localize","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Handlebars = __dependency1__.Handlebars;
    var $ = __dependency1__.$;
    var RSVP = __dependency1__.RSVP;
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

      Handlebars.registerBoundHelper(options.translate, translate);
      Handlebars.registerBoundHelper(options.localize, localize);
    }

    /**
     * Private
     * Fetches the translations from the given url and loads it into I18n.
     * If a callback is provided, it is executed afterwards.
     * @param  {String}   localeName The name of the locale.
     * @param  {String}   urlOrJSON  The url from where to fetch the translations json.
     */
    function loadTranslations(localeName, urlOrJSON){
      if (typeof urlOrJSON === 'object'){
        I18n.translations[localeName] = urlOrJSON;
        return RSVP.Promise.resolve(urlOrJSON);
      } else {
        return new RSVP.Promise(function(resolve, reject){
          $.ajax({url: urlOrJSON, dataType: 'json'}).success(function (json) {
            I18n.translations[localeName] = json;
            resolve(json);
          }).fail(function(jqXHR, textStatus, errorThrown){
            reject(textStatus);
          });
        });
      }
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
    __exports__.translate = translate;
    __exports__.localize = localize;
  });