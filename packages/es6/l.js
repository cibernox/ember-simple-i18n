Ember.Handlebars.registerBoundHelper('l', function(format, value) {
  return I18n.l(format, value);
});