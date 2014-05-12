import Ember from "ember";
import I18n from "./i18n-js"
import translate from "./translate";
import localize from "./localize";

function registerHelpers(options){
  options = options || {};
  options.translate = "translate";
  options.localize  = "localize";

  Ember.Handlebars.registerBoundHelper(options.translate, translate);
  Ember.Handlebars.registerBoundHelper(options.localize, localize);
}

export {
  I18n,
  registerHelpers,
  translate,
  localize
}