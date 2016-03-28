This is the [Uploadcare](https://uploadcare.com/) widget source.

[![Build Status](https://travis-ci.org/uploadcare/uploadcare-widget.png?branch=master)](https://travis-ci.org/uploadcare/uploadcare-widget)

## Embedding

Add following code to your document's `<head>`.

```html
<script>
  // Widget settings
  UPLOADCARE_PUBLIC_KEY = 'your_public_key';
</script>
<script src="https://ucarecdn.com/widget/x.y.z/uploadcare/uploadcare.full.min.js" charset="utf-8"></script>
```

Where `x.y.z` is widget version (2.0.6 for example).
Here is also version without builtin jQuery:

```html
<script>
  // Widget settings
  UPLOADCARE_PUBLIC_KEY = 'your_public_key';
</script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js" charset="utf-8"></script>
<script src="https://ucarecdn.com/widget/x.y.z/uploadcare/uploadcare.min.js" charset="utf-8"></script>
```

The official [Widget documentation](https://uploadcare.com/documentation/widget/)
has more information on using the widget itself.

## Using with Bower

Install uploadcare using `bower` command:

```sh
$ bower install uploadcare
```

Add following code to your document's `<head>`.

```html
<script>
  // Widget settings
  UPLOADCARE_PUBLIC_KEY = 'your_public_key';
  // To use static content from your host   
  UPLOADCARE_SCRIPT_BASE = '/bower_components/uploadcare/';
</script>
<script src="/bower_components/jquery/jquery.js" charset="utf-8"></script>
<script src="/bower_components/uploadcare/uploadcare.js" charset="utf-8"></script>
```

## Using with npm

Install uploadcare using `npm` command:

```sh
$ npm install uploadcare-widget
```

Add following code to your document's `<head>`.

```html
<script>
  // Widget settings
  UPLOADCARE_PUBLIC_KEY = 'your_public_key';
  // To use static content from your host   
  UPLOADCARE_SCRIPT_BASE = '/node_modules/uploadcare-widget/';
</script>
<script src="/node_modules/jquery/jquery.js" charset="utf-8"></script>
<script src="/node_modules/uploadcare-widget/uploadcare.js" charset="utf-8"></script>
```


## Building Your Own

Clone the repository.

### Enviroment

You need a working Ruby 2.0.0 and above environment with [Bundler](http://bundler.io).

#### Vagrant

If you don't want to raise the environment on your machine, you can use [Vagrant](https://www.vagrantup.com/).
Just [install Vagrant](https://www.vagrantup.com/docs/installation/) and [VirtualBox](https://www.virtualbox.org/) or [other provider](https://www.vagrantup.com/docs/getting-started/providers.html).

After open command line, go to this folder and run:

    vagrant up
    vagrant ssh

#### Local environment (without Vagrant)

Inside folder run

    bundle install
    cd ./test/dummy
    bundle install

### Build

* `bundle exec rake js:latest:build` to build assets
  to the **pkg/latest** directory (with the “latest” suffix).
* `bundle exec rake js:release:build` to build assets
  to the **pkg/version** folder (with the current version suffix).
  The version is specified in `lib/uploadcare-widget/version.rb`.

### Development

Go to `test/dummy/`. There is a simple Rails app. Run it:

    bundle exec rails server
    
Open http://127.0.0.1:3000/. Follow any link. 
There's going to be a widget or three. Edit code and reload page :-)


### Testing

[Jasminerice](https://github.com/bradphelan/jasminerice) 
installed under the `test/dummy/` Rails app.

To run tests in your browser go to http://127.0.0.1:3000/jasmine.

For more information see 
[jasminerice docs](https://github.com/bradphelan/jasminerice).

#### guard-jasmine

To run tests in a terminal you must first 
[install phantomjs](https://github.com/guard/guard-jasmine#phantomjs).

Then you have two options:

  - run `bundle exec guard start`
  - run `bundle exec guard-jasmine`

The first one is for continuous tests execution,
the second one runs tests just once.
Both should be executed from the `test/dummy/` directory.

See [guard-jasmine docs](https://github.com/netzpirat/guard-jasmine) 
for more information.
