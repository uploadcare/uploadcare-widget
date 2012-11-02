This is the [Uploadcare](http://uploadcare.com) widget source.
It can also be used as an ordinary Rails plugin.

## Rails Plugin

Add `uploadcare-widget` to your Gemfile in the `assets` section
and add this line to your JavaScript:

    // = require uploadcare/widget

... and to your CSS:

    // = require uploadcare/widget

The official [Uploadcare documentation](http://uploadcare.com/documentation/)
has more information on using the widget itself.

## Building Your Own

You need a working Ruby 1.9 environment with [Bundler](http://gembundler.com/).

* `bundle install` to get build dependencies.
* `bundle exec rake js:latest:build` to build assets
  to the **pkg/latest** directory (with the “latest” suffix).
* `bundle exec rake js:release:build` to build assets
  to the **pkg/version** folder (with the current version suffix).
  The version is specified in `lib/uploadcare-widget/version.rb`.
