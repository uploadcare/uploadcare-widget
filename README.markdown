# uploadcare-widget

This is the [Uploadcare](https://uploadcare.com/) Widget source.

[![Build Status](https://api.travis-ci.org/uploadcare/uploadcare-widget.svg?branch=master)](https://travis-ci.org/uploadcare/uploadcare-widget)

* [Documentation about Uploadcare Widget](https://uploadcare.com/documentation/widget/)
* [Documentation about JavaScript API of Uploadcare Widget](https://uploadcare.com/documentation/javascript_api/)
* Tutorials
  * [Visual tweaks](https://uploadcare.com/cookbook/widget_visual/)
  * [File validation](https://uploadcare.com/cookbook/validation/)
  * [Widget customization](https://uploadcare.com/tutorials/widget_customization/)
  * [Advanced topics](https://uploadcare.com/cookbook/advanced/)
  * [Libraries, plugins and integrations](https://uploadcare.com/documentation/libs/)

## Types of bundles

There are few types of js bundles

* `uploadcare.full.js` — full bundle with built-in jQuery,
* `uploadcare.js` — bundle without built-in jQuery,
* `uploadcare.api.js` — bundle without UI of widget and built-in jQuery,
  just [JavaScript API](https://uploadcare.com/documentation/javascript_api/),
* `uploadcare.ie8.js` — full bundle with built-in jQuery 1.x for support IE 8 (only for widget version 2.x and below),
* `uploadcare.lang.en.js` — bundle without built-in jQuery and only with `en` locale.

All bundle have minified version, just add `.min` before `.js`, for example, `uploadcare.min.js`.

Default exported bundle for npm and other packages managers is `uploadcare.full.min.js`.

## Install

You’re free to choose from the install methods listed below.

### CDN

Embed our client library via `<script>` tag in the `<head>`
section of each page where you’d like to make use of Uploadcare Widget.
Just use this CDN link to use the widget version with built-in jQuery,

```html
<script src="https://ucarecdn.com/libs/widget/3.x/uploadcare.full.min.js" charset="utf-8"></script>
```

Or, if you’re already using jQuery on your page, consider loading
the light version of our widget without built-in jQuery,

```html
<script src="https://code.jquery.com/jquery-3.2.1.min.js" charset="utf-8"></script>
<script src="https://ucarecdn.com/libs/widget/3.x/uploadcare.min.js" charset="utf-8"></script>
```

### NPM

```bash
npm install uploadcare-widget
```

```javascript
import uploadcare from 'uploadcare-widget'
```

### Other install methods

The official Uploadcare Widget [documentation](https://uploadcare.com/documentation/widget/#install)
has more install methods.

## Usage

Once you’re done with the install, there are
two simple steps to take to actually use the widget.

**Set your [public key](https://uploadcare.com/documentation/widget/#option-public-key)**.
This can also sit in the `<head>` section,

```html
<script>
  UPLOADCARE_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
</script>
```

Your secret key is not required for the widget
(it’s quite careless for your page to include any
secret keys anyway.)

**Insert widget element** into your form,

```html
<input type="hidden" role="uploadcare-uploader" name="my_file" />
```

By default, the library looks for inputs with the specified
`role` attribute and places widgets there.
Once a file is uploaded, this `<input>` gets a
CDN link with a file UUID. Your server then
receives this link instead of file content.

We suggest placing the widget somewhere at the top of your form.
Unlike regular inputs, our widget starts uploading files **immediately**
after they get selected by a user, not on form submission.
That way users can fill out the rest of your form while an
upload is in progress. This can be a real time saver.

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
