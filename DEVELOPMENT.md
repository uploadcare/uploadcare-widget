# Uploadcare Widget development guide

Clone the repository.

```bash
git clone https://github.com/uploadcare/uploadcare-widget
```

## Environment

You need a working Ruby 2.0.0 and above environment with [Bundler](http://bundler.io).

### Vagrant

If you don't want to raise the environment on your machine,
you can use [Vagrant](https://www.vagrantup.com/).
Just [install Vagrant](https://www.vagrantup.com/docs/installation/) and [VirtualBox](https://www.virtualbox.org/)
or [other provider](https://www.vagrantup.com/docs/getting-started/providers.html).

After open command line, go to this folder and run:

```bash
vagrant up
vagrant ssh
```

Inside vagrant run

```bash
bundle install
cd ./test/dummy
bundle install
```

### Local environment (without Vagrant)

Inside folder run

```bash
bundle install
cd ./test/dummy
bundle install
```

## Build

* `bundle exec rake js:latest:build` to build assets
  to the **pkg/latest** directory (with the “latest” suffix).
* `bundle exec rake js:release:build` to build assets
  to the **pkg/version** directory (with the current version suffix).
  The version is specified in `lib/uploadcare-widget/version.rb`.

## Development

Go to `test/dummy/`. There is a simple Rails app. Run it:

```bash
bundle exec rails server
```
    
Open http://127.0.0.1:3000/. Follow any link. 
There's going to be a widget or three. Edit code and reload the page :-)

## Testing

[Jasminerice](https://github.com/bradphelan/jasminerice) 
installed under the `test/dummy/` Rails app.

To run tests in your browser go to http://127.0.0.1:3000/jasmine.

For more information, see 
[jasminerice docs](https://github.com/bradphelan/jasminerice).

#### guard-jasmine

To run tests in a terminal you must first 
[install phantomjs](https://github.com/guard/guard-jasmine#phantomjs).

Then, there are two options:

  - run `bundle exec guard start`
  - run `bundle exec guard-jasmine`

The first one is for continuous tests execution,
the second one runs tests just once.
Both should be executed from the `test/dummy/` directory.

See [guard-jasmine docs](https://github.com/netzpirat/guard-jasmine) 
for more information.
