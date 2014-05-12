# Still a WIP.

Look at https://github.com/jamesarosen/ember-i18n for something you can use today.

## Usage

This library is intended to be minimal. It only provides a helper method for translate
strings.

It is backed underneath by [I18n-js](https://github.com/fnando/i18n-js), which uses the
same syntax and conventions that rails' does, but unlike it, is not intended to be used
as a gem.

It provides helpers to internacionalize keys:

Just pass the key of the translation. If it is quoted, it will be looked as
in the translations object.

```handlebars
{{t "title"}} <!--- "My title" --->
```

If a key is unquoted, it will be understood as a bound property, so it is
evaluated in the current context and will be updated if it changes.

```handlebars
{{t titleKey}} <!--- "Translation of the value hold in 'titleKey'" --->
```

Interpolations are passed in the options object.

```handlebars
{{t "salute" name="John"}} <!--- "Hi John" --->
```

Namespaced translations can be expresed in 3 different ways:

A) points

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

In all cases, unquoted values passed on the list are bound to the current
context.
Unquoted values of the trailing options, like the scope or the interpolations
are feched from the context, but they are not bound.

If you want to bound the values in the options, append the suffix 'Binding'
to the property name.

```handlebars
{{t "salute" scope=saluteScopeKey nameBinding=user}} <!--- "Hi John!" --->
```

In this last example, `"salute"` is just a string, `saluteScopeKey` is looked
in the current context but is not bound, and `nameBinding` is bound to the
current context.
