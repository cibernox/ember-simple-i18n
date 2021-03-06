!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),(f.Ember||(f.Ember={})).SimpleI18n=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";
var I18n = _dereq_("./i18n-js")["default"] || _dereq_("./i18n-js");var translateHelper = _dereq_("./translate-helper")["default"] || _dereq_("./translate-helper");
var localizeHelper = _dereq_("./localize-helper")["default"] || _dereq_("./localize-helper");

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

exports.setDefaultLocale = setDefaultLocale;
exports.setLocale = setLocale;
exports.setFallbacks = setFallbacks;
exports.getDefaultLocale = getDefaultLocale;
exports.getLocale = getLocale;
exports.getFallbacks = getFallbacks;
exports.getTranslations = getTranslations;
exports.registerHelpers = registerHelpers;
exports.translateHelper = translateHelper;
exports.localizeHelper = localizeHelper;
exports.translate = translate;
exports.t = t;
exports.localize = localize;
exports.l = l;
},{"./i18n-js":2,"./localize-helper":3,"./translate-helper":4}],2:[function(_dereq_,module,exports){
"use strict";
/**
 * Small customization of https://github.com/fnando/i18n-js, a simple I18n library for
 * internalizalization un javascript using Rails' I18n conventions.
 */

var I18n = {};

// Just cache the Array#slice function.
var slice = Array.prototype.slice;

// Apply number padding.
var padding = function(number) {
  return ("0" + number.toString()).substr(-2);
};

// Set default days/months translations.
var DATE = {
    day_names: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  , abbr_day_names: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  , month_names: [null, "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  , abbr_month_names: [null, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  , meridian: ["AM", "PM"]
};

// Set default number format.
var NUMBER_FORMAT = {
    precision: 3
  , separator: "."
  , delimiter: ","
  , strip_insignificant_zeros: false
};

// Set default currency format.
var CURRENCY_FORMAT = {
    unit: "$"
  , precision: 2
  , format: "%u%n"
  , delimiter: ","
  , separator: "."
};

// Set default percentage format.
var PERCENTAGE_FORMAT = {
    precision: 3
  , separator: "."
  , delimiter: ""
};

// Set default size units.
var SIZE_UNITS = [null, "kb", "mb", "gb", "tb"];

// Other default options
var DEFAULT_OPTIONS = {
  defaultLocale: "en",
  locale: "en",
  defaultSeparator: ".",
  placeholder: /(?:\{\{|%\{)(.*?)(?:\}\}?)/gm,
  fallbacks: false,
  translations: {},
}

I18n.reset = function() {
  // Set default locale. This locale will be used when fallback is enabled and
  // the translation doesn't exist in a particular locale.
  this.defaultLocale = DEFAULT_OPTIONS.defaultLocale;

  // Set the current locale to `en`.
  this.locale = DEFAULT_OPTIONS.locale;

  // Set the translation key separator.
  this.defaultSeparator = DEFAULT_OPTIONS.defaultSeparator;

  // Set the placeholder format. Accepts `{{placeholder}}` and `%{placeholder}`.
  this.placeholder = DEFAULT_OPTIONS.placeholder;

  // Set if engine should fallback to the default locale when a translation
  // is missing.
  this.fallbacks = DEFAULT_OPTIONS.fallbacks;

  // Set the default translation object.
  this.translations = DEFAULT_OPTIONS.translations;
};

// Much like `reset`, but only assign options if not already assigned
I18n.initializeOptions = function() {
  if (typeof(this.defaultLocale) === "undefined" && this.defaultLocale !== null)
    this.defaultLocale = DEFAULT_OPTIONS.defaultLocale;

  if (typeof(this.locale) === "undefined" && this.locale !== null)
    this.locale = DEFAULT_OPTIONS.locale;

  if (typeof(this.defaultSeparator) === "undefined" && this.defaultSeparator !== null)
    this.defaultSeparator = DEFAULT_OPTIONS.defaultSeparator;

  if (typeof(this.placeholder) === "undefined" && this.placeholder !== null)
    this.placeholder = DEFAULT_OPTIONS.placeholder;

  if (typeof(this.fallbacks) === "undefined" && this.fallbacks !== null)
    this.fallbacks = DEFAULT_OPTIONS.fallbacks;

  if (typeof(this.translations) === "undefined" && this.translations !== null)
    this.translations = DEFAULT_OPTIONS.translations;
}
I18n.initializeOptions();

// Return a list of all locales that must be tried before returning the
// missing translation message. By default, this will consider the inline option,
// current locale and fallback locale.
//
//     I18n.locales.get("de-DE");
//     // ["de-DE", "de", "en"]
//
// You can define custom rules for any locale. Just make sure you return a array
// containing all locales.
//
//     // Default the Wookie locale to English.
//     I18n.locales["wk"] = function(locale) {
//       return ["en"];
//     };
//
I18n.locales = {};

// Retrieve locales based on inline locale, current locale or default to
// I18n's detection.
I18n.locales.get = function(locale) {
  var result = this[locale] || this[I18n.locale] || this["default"];

  if (typeof(result) === "function") {
    result = result(locale);
  }

  if (result instanceof Array === false) {
    result = [result];
  }

  return result;
};

// The default locale list.
I18n.locales["default"] = function(locale) {
  var locales = []
    , list = []
    , countryCode
    , count
  ;

  // Handle the inline locale option that can be provided to
  // the `I18n.t` options.
  if (locale) {
    locales.push(locale);
  }

  // Add the current locale to the list.
  if (!locale && I18n.locale) {
    locales.push(I18n.locale);
  }

  // Add the default locale if fallback strategy is enabled.
  if (I18n.fallbacks && I18n.defaultLocale) {
    locales.push(I18n.defaultLocale);
  }

  // Compute each locale with its country code.
  // So this will return an array containing both
  // `de-DE` and `de` locales.
  locales.forEach(function(locale){
    countryCode = locale.split("-")[0];

    if (!~list.indexOf(locale)) {
      list.push(locale);
    }

    if (I18n.fallbacks && countryCode && countryCode !== locale && !~list.indexOf(countryCode)) {
      list.push(countryCode);
    }
  });

  // No locales set? English it is.
  if (!locales.length) {
    locales.push("en");
  }

  return list;
};

// Hold pluralization rules.
I18n.pluralization = {};

// Return the pluralizer for a specific locale.
// If no specify locale is found, then I18n's default will be used.
I18n.pluralization.get = function(locale) {
  return this[locale] || this[I18n.locale] || this["default"];
};

// The default pluralizer rule.
// It detects the `zero`, `one`, and `other` scopes.
I18n.pluralization["default"] = function(count) {
  switch (count) {
    case 0: return ["zero", "other"];
    case 1: return ["one"];
    default: return ["other"];
  }
};

// Return current locale. If no locale has been set, then
// the current locale will be the default locale.
I18n.currentLocale = function() {
  return this.locale || this.defaultLocale;
};

// Check if value is different than undefined and null;
I18n.isSet = function(value) {
  return value !== undefined && value !== null;
};

// Find and process the translation using the provided scope and options.
// This is used internally by some functions and should not be used as an
// public API.
I18n.lookup = function(scope, options) {
  options = this.prepareOptions(options);

  var locales = this.locales.get(options.locale)
    , requestedLocale = locales[0]
    , locale
    , scopes
    , translations
  ;

  while (locales.length) {
    locale = locales.shift();
    scopes = scope.split(this.defaultSeparator);
    translations = this.translations[locale];

    if (!translations) {
      continue;
    }

    while (scopes.length) {
      translations = translations[scopes.shift()];

      if (translations === undefined || translations === null) {
        break;
      }
    }

    if (translations !== undefined && translations !== null) {
      return translations;
    }
  }

  if (this.isSet(options.defaultValue)) {
    return options.defaultValue;
  }
};

// Rails changed the way the meridian is stored.
// It started with `date.meridian` returning an array,
// then it switched to `time.am` and `time.pm`.
// This function abstracts this difference and returns
// and default value when none is provided.
I18n.meridian = function() {
  var time = this.lookup("time");
  var date = this.lookup("date");

  if (time && time.am && time.pm) {
    return [time.am, time.pm];
  } else if (date && date.meridian) {
    return date.meridian;
  } else {
    return DATE.meridian;
  }
};

// Merge serveral hash options, checking if value is set before
// overwriting any value. The precedence is from left to right.
//
//     I18n.prepareOptions({name: "John Doe"}, {name: "Mary Doe", role: "user"});
//     #=> {name: "John Doe", role: "user"}
//
I18n.prepareOptions = function() {
  var args = slice.call(arguments)
    , options = {}
    , subject
  ;

  while (args.length) {
    subject = args.shift();

    if (typeof(subject) != "object") {
      continue;
    }

    for (var attr in subject) {
      if (!subject.hasOwnProperty(attr)) {
        continue;
      }

      if (this.isSet(options[attr])) {
        continue;
      }

      options[attr] = subject[attr];
    }
  }

  return options;
};

// Translate the given scope with the provided options.
I18n.translate = function(scope, options) {
  options = this.prepareOptions(options);
  var translation = this.lookup(scope, options);

  if (translation === undefined || translation === null) {
    return this.missingTranslation(scope);
  }

  if (typeof(translation) === "string") {
    translation = this.interpolate(translation, options);
  } else if (translation instanceof Object && this.isSet(options.count)) {
    translation = this.pluralize(options.count, translation, options);
  }

  return translation;
};

// This function interpolates the all variables in the given message.
I18n.interpolate = function(message, options) {
  options = this.prepareOptions(options);
  var matches = message.match(this.placeholder)
    , placeholder
    , value
    , name
    , regex
  ;

  if (!matches) {
    return message;
  }

  while (matches.length) {
    placeholder = matches.shift();
    name = placeholder.replace(this.placeholder, "$1");
    value = options[name].toString().replace(/\$/gm, "_#$#_");

    if (!this.isSet(options[name])) {
      value = this.missingPlaceholder(placeholder, message);
    }

    regex = new RegExp(placeholder.replace(/\{/gm, "\\{").replace(/\}/gm, "\\}"));
    message = message.replace(regex, value);
  }

  return message.replace("_#$#_", "$");
};

// Pluralize the given scope using the `count` value.
// The pluralized translation may have other placeholders,
// which will be retrieved from `options`.
I18n.pluralize = function(count, scope, options) {
  options = this.prepareOptions(options);
  var translations, pluralizer, keys, key, message;

  if (scope instanceof Object) {
    translations = scope;
  } else {
    translations = this.lookup(scope, options);
  }

  if (!translations) {
    return this.missingTranslation(scope);
  }

  pluralizer = this.pluralization.get(options.locale);
  keys = pluralizer(Math.abs(count));

  while (keys.length) {
    key = keys.shift();

    if (this.isSet(translations[key])) {
      message = translations[key];
      break;
    }
  }

  options.count = String(count);
  return this.interpolate(message, options);
};

// Return a missing translation message for the given parameters.
I18n.missingTranslation = function(scope) {
  var message = '[missing "';

  message += this.currentLocale() + ".";
  message += slice.call(arguments).join(".");
  message += '" translation]';

  return message;
};

// Return a missing placeholder message for given parameters
I18n.missingPlaceholder = function(placeholder, message) {
  return "[missing " + placeholder + " value]";
};

// Format number using localization rules.
// The options will be retrieved from the `number.format` scope.
// If this isn't present, then the following options will be used:
//
// - `precision`: `3`
// - `separator`: `"."`
// - `delimiter`: `","`
// - `strip_insignificant_zeros`: `false`
//
// You can also override these options by providing the `options` argument.
//
I18n.toNumber = function(number, options) {
  options = this.prepareOptions(
      options
    , this.lookup("number.format")
    , NUMBER_FORMAT
  );

  var negative = number < 0
    , string = Math.abs(number).toFixed(options.precision).toString()
    , parts = string.split(".")
    , precision
    , buffer = []
    , formattedNumber
  ;

  number = parts[0];
  precision = parts[1];

  while (number.length > 0) {
    buffer.unshift(number.substr(Math.max(0, number.length - 3), 3));
    number = number.substr(0, number.length -3);
  }

  formattedNumber = buffer.join(options.delimiter);

  if (options.strip_insignificant_zeros && precision) {
    precision = precision.replace(/0+$/, "");
  }

  if (options.precision > 0 && precision) {
    formattedNumber += options.separator + precision;
  }

  if (negative) {
    formattedNumber = "-" + formattedNumber;
  }

  return formattedNumber;
};

// Format currency with localization rules.
// The options will be retrieved from the `number.currency.format` and
// `number.format` scopes, in that order.
//
// Any missing option will be retrieved from the `I18n.toNumber` defaults and
// the following options:
//
// - `unit`: `"$"`
// - `precision`: `2`
// - `format`: `"%u%n"`
// - `delimiter`: `","`
// - `separator`: `"."`
//
// You can also override these options by providing the `options` argument.
//
I18n.toCurrency = function(number, options) {
  options = this.prepareOptions(
      options
    , this.lookup("number.currency.format")
    , this.lookup("number.format")
    , CURRENCY_FORMAT
  );

  number = this.toNumber(number, options);
  number = options.format
    .replace("%u", options.unit)
    .replace("%n", number)
  ;

  return number;
};

// Localize several values.
// You can provide the following scopes: `currency`, `number`, or `percentage`.
// If you provide a scope that matches the `/^(date|time)/` regular expression
// then the `value` will be converted by using the `I18n.toTime` function.
//
// It will default to the value's `toString` function.
//
I18n.localize = function(scope, value) {
  switch (scope) {
    case "currency":
      return this.toCurrency(value);
    case "number":
      scope = this.lookup("number.format");
      return this.toNumber(value, scope);
    case "percentage":
      return this.toPercentage(value);
    default:
      if (scope.match(/^(date|time)/)) {
        return this.toTime(scope, value);
      } else {
        return value.toString();
      }
  }
};

// Parse a given `date` string into a JavaScript Date object.
// This function is time zone aware.
//
// The following string formats are recognized:
//
//    yyyy-mm-dd
//    yyyy-mm-dd[ T]hh:mm::ss
//    yyyy-mm-dd[ T]hh:mm::ss
//    yyyy-mm-dd[ T]hh:mm::ssZ
//    yyyy-mm-dd[ T]hh:mm::ss+0000
//    yyyy-mm-dd[ T]hh:mm::ss+00:00
//    yyyy-mm-dd[ T]hh:mm::ss.123Z
//
I18n.parseDate = function(date) {
  var matches, convertedDate, fraction;
  // we have a date, so just return it.
  if (typeof(date) == "object") {
    return date;
  };

  matches = date.toString().match(/(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}):(\d{2})([\.,]\d{1,3})?)?(Z|\+00:?00)?/);

  if (matches) {
    for (var i = 1; i <= 6; i++) {
      matches[i] = parseInt(matches[i], 10) || 0;
    }

    // month starts on 0
    matches[2] -= 1;

    fraction = matches[7] ? 1000 * ("0" + matches[7]) : null

    if (matches[8]) {
      convertedDate = new Date(Date.UTC(matches[1], matches[2], matches[3], matches[4], matches[5], matches[6], fraction));
    } else {
      convertedDate = new Date(matches[1], matches[2], matches[3], matches[4], matches[5], matches[6], fraction);
    }
  } else if (typeof(date) == "number") {
    // UNIX timestamp
    convertedDate = new Date();
    convertedDate.setTime(date);
  } else if (date.match(/([A-Z][a-z]{2}) ([A-Z][a-z]{2}) (\d+) (\d+:\d+:\d+) ([+-]\d+) (\d+)/)) {
    // This format `Wed Jul 20 13:03:39 +0000 2011` is parsed by
    // webkit/firefox, but not by IE, so we must parse it manually.
    convertedDate = new Date();
    convertedDate.setTime(Date.parse([
      RegExp.$1, RegExp.$2, RegExp.$3, RegExp.$6, RegExp.$4, RegExp.$5
    ].join(" ")));
  } else if (date.match(/\d+ \d+:\d+:\d+ [+-]\d+ \d+/)) {
    // a valid javascript format with timezone info
    convertedDate = new Date();
    convertedDate.setTime(Date.parse(date));
  } else {
    // an arbitrary javascript string
    convertedDate = new Date();
    convertedDate.setTime(Date.parse(date));
  }

  return convertedDate;
};

// Formats time according to the directives in the given format string.
// The directives begins with a percent (%) character. Any text not listed as a
// directive will be passed through to the output string.
//
// The accepted formats are:
//
//     %a  - The abbreviated weekday name (Sun)
//     %A  - The full weekday name (Sunday)
//     %b  - The abbreviated month name (Jan)
//     %B  - The full month name (January)
//     %c  - The preferred local date and time representation
//     %d  - Day of the month (01..31)
//     %-d - Day of the month (1..31)
//     %H  - Hour of the day, 24-hour clock (00..23)
//     %-H - Hour of the day, 24-hour clock (0..23)
//     %I  - Hour of the day, 12-hour clock (01..12)
//     %-I - Hour of the day, 12-hour clock (1..12)
//     %m  - Month of the year (01..12)
//     %-m - Month of the year (1..12)
//     %M  - Minute of the hour (00..59)
//     %-M - Minute of the hour (0..59)
//     %p  - Meridian indicator (AM  or  PM)
//     %S  - Second of the minute (00..60)
//     %-S - Second of the minute (0..60)
//     %w  - Day of the week (Sunday is 0, 0..6)
//     %y  - Year without a century (00..99)
//     %-y - Year without a century (0..99)
//     %Y  - Year with century
//     %z  - Timezone offset (+0545)
//
I18n.strftime = function(date, format) {
  var options = this.lookup("date")
    , meridianOptions = I18n.meridian()
  ;

  if (!options) {
    options = {};
  }

  options = this.prepareOptions(options, DATE);

  var weekDay = date.getDay()
    , day = date.getDate()
    , year = date.getFullYear()
    , month = date.getMonth() + 1
    , hour = date.getHours()
    , hour12 = hour
    , meridian = hour > 11 ? 1 : 0
    , secs = date.getSeconds()
    , mins = date.getMinutes()
    , offset = date.getTimezoneOffset()
    , absOffsetHours = Math.floor(Math.abs(offset / 60))
    , absOffsetMinutes = Math.abs(offset) - (absOffsetHours * 60)
    , timezoneoffset = (offset > 0 ? "-" : "+") +
        (absOffsetHours.toString().length < 2 ? "0" + absOffsetHours : absOffsetHours) +
        (absOffsetMinutes.toString().length < 2 ? "0" + absOffsetMinutes : absOffsetMinutes)
  ;

  if (hour12 > 12) {
    hour12 = hour12 - 12;
  } else if (hour12 === 0) {
    hour12 = 12;
  }

  format = format.replace("%a", options.abbr_day_names[weekDay]);
  format = format.replace("%A", options.day_names[weekDay]);
  format = format.replace("%b", options.abbr_month_names[month]);
  format = format.replace("%B", options.month_names[month]);
  format = format.replace("%d", padding(day));
  format = format.replace("%e", day);
  format = format.replace("%-d", day);
  format = format.replace("%H", padding(hour));
  format = format.replace("%-H", hour);
  format = format.replace("%I", padding(hour12));
  format = format.replace("%-I", hour12);
  format = format.replace("%m", padding(month));
  format = format.replace("%-m", month);
  format = format.replace("%M", padding(mins));
  format = format.replace("%-M", mins);
  format = format.replace("%p", meridianOptions[meridian]);
  format = format.replace("%S", padding(secs));
  format = format.replace("%-S", secs);
  format = format.replace("%w", weekDay);
  format = format.replace("%y", padding(year));
  format = format.replace("%-y", padding(year).replace(/^0+/, ""));
  format = format.replace("%Y", year);
  format = format.replace("%z", timezoneoffset);

  return format;
};

// Convert the given dateString into a formatted date.
I18n.toTime = function(scope, dateString) {
  var date = this.parseDate(dateString)
    , format = this.lookup(scope)
  ;

  if (date.toString().match(/invalid/i)) {
    return date.toString();
  }

  if (!format) {
    return date.toString();
  }

  return this.strftime(date, format);
};

// Convert a number into a formatted percentage value.
I18n.toPercentage = function(number, options) {
  options = this.prepareOptions(
      options
    , this.lookup("number.percentage.format")
    , this.lookup("number.format")
    , PERCENTAGE_FORMAT
  );

  number = this.toNumber(number, options);
  return number + "%";
};

// Convert a number into a readable size representation.
I18n.toHumanSize = function(number, options) {
  var kb = 1024
    , size = number
    , iterations = 0
    , unit
    , precision
  ;

  while (size >= kb && iterations < 4) {
    size = size / kb;
    iterations += 1;
  }

  if (iterations === 0) {
    unit = this.t("number.human.storage_units.units.byte", {count: size});
    precision = 0;
  } else {
    unit = this.t("number.human.storage_units.units." + SIZE_UNITS[iterations]);
    precision = (size - Math.floor(size) === 0) ? 0 : 1;
  }

  options = this.prepareOptions(
      options
    , {precision: precision, format: "%n%u", delimiter: ""}
  );

  number = this.toNumber(size, options);
  number = options.format
    .replace("%u", unit)
    .replace("%n", number)
  ;

  return number;
};

// Set aliases, so we can save some typing.
I18n.t = I18n.translate;
I18n.l = I18n.localize;
I18n.p = I18n.pluralize;

exports["default"] = I18n;
},{}],3:[function(_dereq_,module,exports){
"use strict";
var I18n = _dereq_("./i18n-js")["default"] || _dereq_("./i18n-js");

exports["default"] = function(format, value) {
  return I18n.l(format, value);
}
},{"./i18n-js":2}],4:[function(_dereq_,module,exports){
"use strict";
/**
 * Helper for translate entries.
 *
 * Usage:
 *
 *
 *
 * *** Keys ***
 *
 * Just pass the key of the translation. If it is quoted, it will be looked as
 * in the translations object.
 *
 * {{t "title"}} => "My title"
 *
 * If a key is unquoted, it will be understood as a bound property, so it is
 * evaluated in the current context and will be updated if it changes.
 *
 * {{t titleKey}} => "Translation of the value hold in 'titleKey'"
 *
 *
 *
 * *** Interpolations ***
 *
 * Interpolations are passed in the options object.
 *
 * {{t "salute" name="John"}} => "Hi John"
 *
 *
 *
 * *** Namespaces ***
 *
 * Namespaced translations can be expresed in 3 different ways:
 *
 * A) points
 *
 * {{t "posts.title"}} => "All your posts"
 *
 * B) passing a list of values
 *
 * {{t "posts" "title"}} => "All your posts"
 *
 * C) passing a key and a scope
 *
 * {{t "posts" scope="title"}} => "All your posts"
 *
 *
 * *** Parameters ***
 *
 * In all cases, unquoted values passed on the list are bound to the current
 * context.
 * Unquoted values of the trailing options, like the scope or the interpolations
 * are feched from the context, but they are not bound.
 *
 * If you want to bound the values in the options, append the suffix 'Binding'
 * to the property name.
 *
 * {{t "salute" scope=saluteScopeKey nameBinding=user}} => "Hi John!"
 *
 * In this last example, `"salute"` is just a string, `saluteScopeKey` is looked
 * in the current context but is not bound, and `nameBinding` is bound to the
 * current context.
 *
 * @return {string} The translated value
 */

var I18n = _dereq_("./i18n-js")["default"] || _dereq_("./i18n-js");

exports["default"] = function() {
  var length = arguments.length,
    options  = arguments[length - 1],
    keys     = [],
    opts     = {},
    i, key;

  for (key in options.hashTypes){
    if (options.hashTypes[key] !== 'ID'){
      opts[key] = options.hash[key];
    } else if (key.slice(-7) === 'Binding'){
      opts[key.slice(0, -7)] = options.hash[key.slice(0, -7)];
    } else {
      opts[key] = Ember.get(this, options.hash[key]);
    }
  }

  if (opts.scope) {
    keys = [opts.scope];
    delete opts.scope;
  }

  for (i = 0; i < length - 1; i++){
    keys.push(arguments[i]);
  }

  return I18n.t(keys.join('.'), opts);
}
},{"./i18n-js":2}]},{},[1])
(1)
});