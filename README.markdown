This is the [Uploadcare](http://uploadcare.com) widget source.

## Embedding

Add following code to your document's `<head>`.

```html
<script>
  // Widget settings
  UPLOADCARE_PUBLIC_KEY = 'your_public_key';
</script>
<script src="https://ucarecdn.com/widget/x.y.z/uploadcare/uploadcare-x.y.z.min.js"></script>
```

The official [Widget documentation](https://uploadcare.com/documentation/widget/)
has more information on using the widget itself.

## Building Your Own

You need a working Ruby 1.9.3 environment
with [Bundler](http://gembundler.com/).

* `bundle install` to get build dependencies.
* `bundle exec rake js:latest:build` to build assets
  to the **pkg/latest** directory (with the “latest” suffix).
* `bundle exec rake js:release:build` to build assets
  to the **pkg/version** folder (with the current version suffix).
  The version is specified in `lib/uploadcare-widget/version.rb`.


## Development

Clone the repository, and go to `test/dummy/`. There is a simple Rails site. Run it:

    bundle install
    bundle update
    bundle exec rails server
    
Open http://0.0.0.0:3000/ . Follow any link. 
There's going to be a widget or three. Edit code and reload page :-)


## Tests

[Jasminerice](https://github.com/bradphelan/jasminerice) 
installed under `test/dummy/` Rails application.

To run tests in your browser go to http://0.0.0.0:3000/jasmine.

For more information see 
[jasminerice docs](https://github.com/bradphelan/jasminerice).
