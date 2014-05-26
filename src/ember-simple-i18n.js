import {Handlebars, $, RSVP} from "ember";
import I18n from "./i18n-js"
import translate from "./translate";
import localize from "./localize";

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


export {
  setDefaultLocale,
  setLocale,
  setFallbacks,
  getDefaultLocale,
  getLocale,
  getFallbacks,
  getTranslations,
  registerHelpers,
  translate,
  localize
}