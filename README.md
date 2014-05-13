# Ember Simple I18n

**Warning: This is still a work in progress!**

If you need something that can be used today, check out [ember-i18n](https://github.com/jamesarosen/ember-i18n) by James Alexander Rosen.

This library is intended to be minimal. It only provides a helper method for translating
strings.

It uses the [I18n-js](https://github.com/fnando/i18n-js) library, which uses the
same syntax and conventions that Rails does, but unlike i18n-js, this project is not
intended to be used as a gem.

## Usage

Pass the key of the translation.

If it is quoted, it will look that property up in the translations object
and insert the current value of the property.

```handlebars
{{t "title"}} <!--- "My title" --->
```

If a key is unquoted, it will be understood as a bound property, and
evaluated in the current context, updating the value if it changes.

```handlebars
{{t titleKey}} <!--- "Translation of the value held in 'titleKey'" --->
```

Interpolations are passed using the options object.

```handlebars
{{t "salute" name="John"}} <!--- "Hi John" --->
```

### Namespaced Translations

There are three ways in which namespaced translations can be expressed:

A) dot notation

```handlebars
{{t "posts.title"}} <!--- "All your posts" --->
```

B) passing a list of values

```handlebars
{{t "posts" "title"}} <!--- "All your posts" --->
```

C) passing a key and a scope

```handlebars
{{t "posts" scope="title"}} <!--- "All your posts" --->
```

In all cases, unquoted values passed to the list are bound to the current
context.

Values passed using the options object, such as the scope or the
interpolations, are not bound, even if they are unquoted. They
are fetched from the current context.

If you want to bind the values in the options, append the suffix
`'Binding'` to the property name:

```handlebars
{{t "salute" scope=informal nameBinding=user}} <!--- "Hi John!" --->
```

In this last example, `"salute"` is just a string, `informal` is looked
up in the current context but is not bound, and `nameBinding` is bound
to the current context.
