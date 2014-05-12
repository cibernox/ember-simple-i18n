import Ember from "ember";
import translate from "./translate";
import localize from "./localize";

var defaultOptions = {translate: "translate", localize: "localize"};

function registerHelpers(options){
  options = options || {};
  options.translate = "translate";
  options.localize  = "localize";

  Ember.Handlebars.registerBoundHelper(options.translate, translate);
  Ember.Handlebars.registerBoundHelper(options.localize, localize);
}

export {
  registerHelpers,
  translate,
  localize
}