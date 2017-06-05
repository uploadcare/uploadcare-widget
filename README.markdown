# uploadcare-widget

This is the [Uploadcare](https://uploadcare.com/) Widget source.

[![Build Status](https://api.travis-ci.org/uploadcare/uploadcare-widget.svg?branch=master)](https://travis-ci.org/uploadcare/uploadcare-widget)

* [Docs, Uploadcare Widget](https://uploadcare.com/documentation/widget/)
* [Docs, Uploadcare Widget JavaScript API](https://uploadcare.com/documentation/javascript_api/)
* Tutorials
  * [Visual tweaks](https://uploadcare.com/cookbook/widget_visual/)
  * [File validation](https://uploadcare.com/cookbook/validation/)
  * [Widget customization](https://uploadcare.com/tutorials/widget_customization/)
  * [Advanced topics](https://uploadcare.com/cookbook/advanced/)
  * [Libraries, plugins and integrations](https://uploadcare.com/documentation/libs/)

## Browser Support

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
        <td>Safari: 8+</td>
        <td>iOS Safari: 8+</td>
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

## Types of bundles

There's a few types of js bundles

* `uploadcare.full.js` — a full bundle with built-in jQuery,
* `uploadcare.js` — a bundle without built-in jQuery,
* `uploadcare.api.js` — a bundle without UI of widget and built-in jQuery,
  [JavaScript API](https://uploadcare.com/documentation/javascript_api/) only,
* `uploadcare.ie8.js` — a full bundle with built-in jQuery 1.x for IE 8 support (widget v. 2.x and below),
* `uploadcare.lang.en.js` — a bundle without built-in jQuery, `en` locale only.

Each bundle has its minified version. Just add `.min` before `.js`, e.g. `uploadcare.min.js`.

By default, `uploadcare.full.min.js` is exported for npm and other package managers.

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

### Usage with React

```javascript
import React, {Component} from 'react'
import uploadcare from 'uploadcare-widget'

class Uploader extends Component {

  componentDidMount() {
    uploadcare.start({publicKey: 'YOUR_PUBLIC_KEY'})
  }

  render() {
    return (
      <div>
        <input type='text' role='uploadcare-uploader'/>
      </div>
    )
  }
}

export default Uploader
```

See [full demo](https://github.com/uploadcare/uploadcare-widget-react-demo/).

### Usage with Angular

We have the Angular 1 directive for Uploadcare Widget.
See [angular-uploadcare](https://github.com/uploadcare/angular-uploadcare).

For Angular 2, [this demo](https://plnkr.co/edit/6caWQ6cct4L3715LehxZ?p=preview) might be useful.

## Configuration

The widget is highly customizable through widget options.
All configuration options together with ways to set them are
described in [our docs](https://uploadcare.com/documentation/widget/#configuration).

## JavaScript API

You might not want to use all the features that
[our widget](https://uploadcare.com/documentation/widget/) exhibits.
Or, perhaps, you might want to redesign the user experience
without having to reinvent the wheel.
Maybe, you're in pursuit of building a UI on top of the widget.
For all of those use cases, we provide a
[JavaScript API](https://uploadcare.com/documentation/javascript_api/).
Feel free to control the default widget with it,
or make use of its standalone components that
can be combined with your own solutions.

## Localization

It’s possible that your locale is not available in the widget yet.
If that’s the case, contributing your locale might be a good idea.
This can be done by forking the [main repository](https://github.com/uploadcare/uploadcare-widget)
and adding a localization file
[here](https://github.com/uploadcare/uploadcare-widget/tree/master/app/assets/javascripts/uploadcare/locale).

## Development

Guide how to development Uploadcare Widget
at [DEVELOPMENT.md](https://github.com/uploadcare/uploadcare-widget/blob/master/DEVELOPMENT.md).
