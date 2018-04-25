# Uploadcare Widget

<a href="https://uploadcare.com/?utm_source=github&utm_campaign=uploadcare-widget">
    <img align="right" width="64" height="64"
         src="https://ucarecdn.com/2f4864b7-ed0e-4411-965b-8148623aa680/uploadcare-logo-mark.svg"
         alt="">
</a>

Uploadcare Widget is an HTML5 file uploader, a part of the
[Uploadcare](https://uploadcare.com/?utm_source=github&utm_campaign=uploadcare-widget)
ecosystem that fully covers your file handling.

Uploads affect your web or mobile app performance. The widget ensures all of your
uploads are fast and hit their target.

[![NPM version][npm-img]][npm-link] [![Build Status][travis-img]][travis] [![Uploadcare stack on StackShare][stack-img]][stack]

It’s provided as a typical JavaScript library and can be easily embedded in your
site.

The widget is highly customizable to fit your needs. It supports multi-file
uploads, manual crop, and integrates with social media and cloud storage
providers.

[npm-img]: http://img.shields.io/npm/v/uploadcare-widget.svg
[npm-link]: https://www.npmjs.org/package/uploadcare-widget
[travis-img]: https://api.travis-ci.org/uploadcare/uploadcare-widget.svg?branch=master
[travis]: https://travis-ci.org/uploadcare/uploadcare-widget
[stack-img]: https://img.shields.io/badge/tech-stack-0690fa.svg?style=flat
[stack]: https://stackshare.io/uploadcare/stacks/

<a href="https://uploadcare.com/widget/configure/" title="Play with the widget">
  <img src="https://ucarecdn.com/021e5297-c1c4-43d4-97fc-6de7dd97c856/"
       width="888" alt="Widget in action">
</a>

## Docs

See the complete widget docs [here](https://uploadcare.com/docs/uploads/widget/).

### Quick references

* [JavaScript API](https://uploadcare.com/docs/api_reference/javascript/)
* [Live widget config](https://uploadcare.com/widget/configure/)
* [In-browser image editing](https://uploadcare.com/features/effects_tab/)
* [Libraries, plugins and integrations](https://uploadcare.com/docs/libs/)
* Tutorials
  * [Visual tweaks](https://uploadcare.com/docs/uploads/widget/visual_tweaks/)
  * [File validation](https://uploadcare.com/docs/uploads/widget/validation/)
  * [Widget customization](https://uploadcare.com/docs/uploads/widget/styling/)
  * [Advanced topics](https://uploadcare.com/docs/guides/advanced/)
* [Migration guide from v2 to v3](https://uploadcare.com/docs/uploads/widget/migration_v2_v3/)

## Types of bundles

There are a few types of JS bundles:

* `uploadcare.full.js` — a full bundle with built-in jQuery.
* `uploadcare.js` — a bundle without built-in jQuery.
* `uploadcare.api.js` — a bundle without UI of the widget and built-in jQuery
  [JavaScript API](https://uploadcare.com/documentation/javascript_api/) only.
* `uploadcare.ie8.js` — a full bundle with built-in jQuery 1.x for IE 8 support
  (widget v. 2.x and below).
* `uploadcare.lang.en.js` — a bundle without built-in jQuery, `en` locale only.

Each bundle has its minified version. Just add `.min` before `.js`,
e.g. `uploadcare.min.js`.

By default, `uploadcare.min.js` is exported for npm and other package managers.

## Install

You’re free to choose from the install methods listed below.

### NPM

```bash
npm install uploadcare-widget --save
```

```javascript
import uploadcare from 'uploadcare-widget'
```

### CDN

Embed our client library via the `<script>` tag in the `<head>`
section of each page where you’d like to use Uploadcare Widget.
Here is the CDN link to the current widget version with built-in jQuery,

```html
<script src="https://ucarecdn.com/libs/widget/3.x/uploadcare.full.min.js" charset="utf-8"></script>
```

Or, if you’re already using jQuery on your page, consider loading
the light version of the widget: without built-in jQuery,

```html
<script src="https://code.jquery.com/jquery-3.2.1.min.js" charset="utf-8"></script>
<script src="https://ucarecdn.com/libs/widget/3.x/uploadcare.min.js" charset="utf-8"></script>
```

### Other install methods

Check out the widget [docs](https://uploadcare.com/docs/uploads/widget/install/)
for more install methods.

## Usage

Once you’re done with the install, there are
two simple steps to take to use the widget.

**Set your [public key](https://uploadcare.com/docs/uploads/widget/config/#option-public-key)**.
This can also sit in the `<head>` section,

```html
<script>
  UPLOADCARE_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
</script>
```

Your secret key is not required for the widget; (it’s quite careless for your
page to include any secret keys anyway.

**Insert widget element** into your form,

```html
<input type="hidden" role="uploadcare-uploader" name="my_file" />
```

By default, the library looks for inputs with the specified
`role` attribute and places widgets there.
Once a file is uploaded, this `<input>` gets a
CDN link with a file UUID. Your server then
receives this link, not file content.

We suggest placing the widget somewhere at the top of your form.
Unlike regular inputs, our widget starts uploading files **immediately**
after they get selected by a user, not on form submission.
That way users can fill out the rest of your form while an
upload is in progress. This can be a real time saver.

### Usage with React

See [demo app](https://github.com/uploadcare/uploadcare-widget-react-demo/).

### Usage with Angular

Check out our
[Angular 2+ wrapper](https://www.npmjs.com/package/ngx-uploadcare-widget) for
Uploadcare Widget.

[angular-uploadcare](https://github.com/uploadcare/angular-uploadcare) can be
used with Angular 1.

## Configuration

The widget is highly customizable with widget options. Check out the existing
options and ways to set them in UC
[docs](https://uploadcare.com/docs/uploads/widget/config/).

## JavaScript API

You might not want to use all the features that
[our widget](https://uploadcare.com/docs/uploads/widget/) exhibits.
Or, perhaps, you might want to redesign the user experience
without having to reinvent the wheel.
Maybe, you're in pursuit of building a UI on top of the widget.
For all of those use cases, we provide a
[JavaScript API](https://uploadcare.com/docs/api_reference/javascript/).
Feel free to control the default widget with it,
or make use of its standalone components that
can be combined with your solutions.

## Localization

It’s possible that your locale is not available in the widget yet.
If that’s the case, contributing your locale might be a good idea.
This can be done by forking the [main repository](https://github.com/uploadcare/uploadcare-widget)
and adding a localization file
[here](https://github.com/uploadcare/uploadcare-widget/tree/master/app/assets/javascripts/uploadcare/locale).

Until that you can use [`UPLOADCARE_LOCALE_TRANSLATIONS`](https://uploadcare.com/docs/uploads/widget/locales/)
property to use your locale immediately.

## Browser Support

The widget should work perfectly in a couple of the latest versions
of major desktop browsers: Internet Explorer, Edge, Firefox, Google Chrome,
Safari, and Opera. It is most likely to run well in older versions
of major browser too, except for Internet Explorer < 10.

If you need the support for older browsers including IE8, consider using
[the widget version 2.x][v2ie8] instead.

[v2ie8]: https://uploadcare.com/documentation/widget/v2/

<div>
  <table>
    <thead>
      <tr>
        <th>Desktop</th>
        <th>Mobile</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Chrome: 37+</td>
        <td>Android Browser: 4.4+</td>
      </tr>
      <tr>
        <td>Firefox: 32+</td>
        <td>Opera Mobile: 8+</td>
      </tr>
      <tr>
        <td>Safari: 9+</td>
        <td>iOS Safari: 9+</td>
      </tr>
      <tr>
        <td>Edge: 12+</td>
        <td>IE Mobile: 11+</td>
      </tr>
      <tr>
        <td>IE: 10+</td>
        <td>Opera Mini: Last</td>
      </tr>
    </tbody>
  </table>
</div>

## Development

Check out the Uploadcare Widget
[development guide](https://github.com/uploadcare/uploadcare-widget/blob/master/DEVELOPMENT.md).
