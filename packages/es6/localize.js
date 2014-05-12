// Ember.Handlebars.registerBoundHelper('l',
export default function(format, value) {
  return I18n.l(format, value);
}