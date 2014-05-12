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
Ember.Handlebars.registerBoundHelper('t', function() {
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
});