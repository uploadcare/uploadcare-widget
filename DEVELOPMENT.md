# Uploadcare Widget development guide

Clone the repository.

```bash
git clone https://github.com/uploadcare/uploadcare-widget
```

## Environment

You need a working nodejs and npm.

## Build

```bash
npm install
npm run build
```

## Development

Go to `test/dummy/`. There is a simple Rails app. Run it:

```bash
bundle exec rails server
```
    
Open http://127.0.0.1:3000/. Follow any link. 
There's going to be a widget or three. Edit code and reload the page :-)

## Testing

Use [Jasminerice](https://github.com/bradphelan/jasminerice)
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
