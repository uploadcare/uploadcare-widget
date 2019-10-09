# Uploadcare Widget

<a href="https://uploadcare.com/?utm_source=github&utm_campaign=uploadcare-widget">
    <img align="right" width="64" height="64"
         src="https://ucarecdn.com/2f4864b7-ed0e-4411-965b-8148623aa680/uploadcare-logo-mark.svg"
         alt="">
</a>

Uploadcare Widget is an HTML5 file uploader, a part of the [Uploadcare][uc-home]
file handling platform.

[![NPM version][badge-npm-img]][badge-npm-url]
[![Build Status][badge-travis-img]][badge-travis-url]
[![Uploadcare stack on StackShare][badge-stack-img]][badge-stack-url]

Uploads affect your web or mobile app performance. The widget ensures you
integrate file uploading into your product in minutes, no matter the development
stack.

The widget features:

* Drag&Drop selection.
* Over a dozen [upload sources][uc-docs-widget-sources] including social media
  and cloud storage providers.
* Multiple file upload with individual progress bars.
* File moderation through validation by file size, extension or MIME type.
* Image preview and image crop.
* [Libraries and integrations][uc-libs] for JavaScript, PHP, Python, Java,
  Django, Ruby on Rails, Angular, and more.
* 20+ languages, [learn more][uc-docs-widget-locales].

We provide the file uploader as a typical JavaScript library; it can be easily
embedded in your site.

Using the older `2.x` version? Check out the stuff under the
[v2 tag][github-branch-v2].

<a href="https://uploadcare.com/widget/configure/" title="Play with the widget">
  <img src="https://ucarecdn.com/021e5297-c1c4-43d4-97fc-6de7dd97c856/"
       width="888" alt="Widget in action">
</a>

---

<!-- toc -->

* [Docs](#docs)
  * [Quick references](#quick-references)
* [Types of bundles](#types-of-bundles)
* [Install](#install)
  * [NPM](#npm)
  * [CDN](#cdn)
  * [Other install methods](#other-install-methods)
* [Usage](#usage)
  * [Usage with React](#usage-with-react)
  * [Usage with Angular](#usage-with-angular)
* [Configuration](#configuration)
* [JavaScript API](#javascript-api)
* [Localization](#localization)
* [Browser Support](#browser-support)
* [Development](#development)
* [Security issues](#security-issues)
* [Feedback](#feedback)

<!-- tocstop -->

## Docs

See the complete widget docs [here][uc-docs-widget].
If you're looking for the widget v2 docs, check out [here][uc-docs-widget-v2].

### Quick references

* [JavaScript API][uc-docs-widget-js-api]
* [Live widget config][uc-widget-configurator]
* [In-browser image editing][uc-features-effects-tab]
* [Libraries, plugins and integrations][uc-docs-libs]
* Tutorials
  * [Visual tweaks][uc-docs-widget-visual-tweaks]
  * [File validation][uc-docs-widget-validation]
  * [Widget customization][uc-docs-widget-styling]
  * [Advanced topics][uc-guides-advanced]
* [Migration guide from v2 to v3][uc-docs-widget-migration-v2-v3]

## Types of bundles

There are a few types of JS bundles:

* `uploadcare.full.js` — a full bundle with built-in jQuery.
* `uploadcare.js` — a bundle without built-in jQuery.
* `uploadcare.api.js` — a bundle without UI of the widget and built-in jQuery
  [JavaScript API][uc-docs-widget-js-api] only.
* `uploadcare.lang.en.js` — a bundle without built-in jQuery, `en` locale only.

Each bundle has its minified version. Just add `.min` before `.js`,
e.g. `uploadcare.min.js`.

By default, `uploadcare.js` is exported for npm and other package managers.

## Install

You’re free to choose from the install methods listed below.

### NPM

```bash
npm install uploadcare-widget
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
<script src="https://code.jquery.com/jquery-3.4.1.min.js" charset="utf-8"></script>
<script src="https://ucarecdn.com/libs/widget/3.x/uploadcare.min.js" charset="utf-8"></script>
```

### Other install methods

Check out the widget [docs][uc-docs-widget-install]
for more install methods.

## Usage

Once you’re done with the install, there are
two simple steps to take to use the widget.

**Set your [public key][uc-docs-widget-options-public-key]**.
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

Check out our [React component](https://github.com/uploadcare/react-widget/)
for Uploadcare Widget.

### Usage with Angular

Check out our
[Angular 2+ wrapper](https://www.npmjs.com/package/ngx-uploadcare-widget) for
Uploadcare Widget.

[angular-uploadcare](https://github.com/uploadcare/angular-uploadcare) can be
used with Angular 1.

## Configuration

The widget is highly customizable with widget options. Check out the existing
options and ways to set them in UC
[docs][uc-docs-widget-config].

## JavaScript API

You might not want to use all the features that
[our widget][uc-docs-widget] exhibits.
Or, perhaps, you might want to redesign the user experience
without having to reinvent the wheel.
Maybe, you're in pursuit of building a UI on top of the widget.
For all of those use cases, we provide a
[JavaScript API][uc-docs-widget-js-api].
Feel free to control the default widget with it,
or make use of its standalone components that
can be combined with your solutions.

## Localization

It’s possible that your locale is not available in the widget yet.
If that’s the case, contributing your locale might be a good idea.
This can be done by forking the [main repository][github-home]
and adding a localization file [here][github-files-locales].

Until that you can use [`UPLOADCARE_LOCALE_TRANSLATIONS`][uc-docs-widget-options-locale-translations]
property to use your locale immediately.

## Browser Support

The widget should work perfectly in a couple of the latest versions
of major desktop browsers: Internet Explorer, Edge, Firefox, Google Chrome,
Safari, and Opera. It is most likely to run well in older versions
of major browser too, except for Internet Explorer < 10.

If you need the support for older browsers including IE8, consider using
[the widget v2][github-branch-v2] instead.

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

Check out the Uploadcare Widget [development guide][github-files-development].

## Security issues

If you think you ran into something in Uploadcare libraries which might have
security implications, please hit us up at [bugbounty@uploadcare.com][uc-email-bounty]
or Hackerone.

We'll contact you personally in a short time to fix an issue through co-op and
prior to any public disclosure.

## Feedback

Issues and PRs are welcome. You can provide your feedback or drop us a support
request at [hello@uploadcare.com][uc-email-hello].

[badge-npm-img]: http://img.shields.io/npm/v/uploadcare-widget.svg
[badge-npm-url]: https://www.npmjs.org/package/uploadcare-widget
[badge-travis-img]: https://api.travis-ci.org/uploadcare/uploadcare-widget.svg?branch=master
[badge-travis-url]: https://travis-ci.org/uploadcare/uploadcare-widget
[badge-stack-img]: https://img.shields.io/badge/tech-stack-0690fa.svg?style=flat
[badge-stack-url]: https://stackshare.io/uploadcare/stacks/
[github-branch-v2]: https://github.com/uploadcare/uploadcare-widget/tree/v2
[github-home]: https://github.com/uploadcare/uploadcare-widget
[github-files-locales]: https://github.com/uploadcare/uploadcare-widget/tree/master/src/locales
[github-files-development]: https://github.com/uploadcare/uploadcare-widget/blob/master/DEVELOPMENT.md
[uc-email-bounty]: mailto:bugbounty@uploadcare.com
[uc-email-hello]: mailto:hello@uploadcare.com
[uc-libs]: https://uploadcare.com/docs/libs/?utm_source=github&utm_campaign=uploadcare-widget
[uc-home]: https://uploadcare.com/?utm_source=github&utm_campaign=uploadcare-widget
[uc-features-effects-tab]: https://uploadcare.com/features/effects_tab/?utm_source=github&utm_campaign=uploadcare-widget
[uc-widget-configurator]: https://uploadcare.com/widget/configure/?utm_source=github&utm_campaign=uploadcare-widget
[uc-docs-libs]: https://uploadcare.com/docs/libs/?utm_source=github&utm_campaign=uploadcare-widget
[uc-docs-widget-v2]: https://uploadcare.com/documentation/widget/v2/?utm_source=github&utm_campaign=uploadcare-widget
[uc-docs-widget]: https://uploadcare.com/docs/uploads/widget/?utm_source=github&utm_campaign=uploadcare-widget
[uc-docs-widget-js-api]: https://uploadcare.com/docs/api_reference/javascript/?utm_source=github&utm_campaign=uploadcare-widget
[uc-docs-widget-visual-tweaks]: https://uploadcare.com/docs/uploads/widget/visual_tweaks/?utm_source=github&utm_campaign=uploadcare-widget
[uc-docs-widget-validation]: https://uploadcare.com/docs/uploads/widget/validation/?utm_source=github&utm_campaign=uploadcare-widget
[uc-docs-widget-styling]: https://uploadcare.com/docs/uploads/widget/styling/?utm_source=github&utm_campaign=uploadcare-widget
[uc-docs-widget-migration-v2-v3]: https://uploadcare.com/docs/uploads/widget/migration_v2_v3/?utm_source=github&utm_campaign=uploadcare-widget
[uc-docs-widget-install]: https://uploadcare.com/docs/uploads/widget/install/?utm_source=github&utm_campaign=uploadcare-widget
[uc-docs-widget-options-public-key]: https://uploadcare.com/docs/uploads/widget/config/?utm_source=github&utm_campaign=uploadcare-widget#option-public-key
[uc-docs-widget-options-locale-translations]: https://uploadcare.com/docs/uploads/widget/config/?utm_source=github&utm_campaign=uploadcare-widget#option-locale-translations
[uc-docs-widget-sources]: https://uploadcare.com/docs/uploads/widget/locales/?utm_source=github&utm_campaign=uploadcare-widget
[uc-docs-widget-config]: https://uploadcare.com/docs/uploads/widget/config/?utm_source=github&utm_campaign=uploadcare-widget
[uc-docs-widget-locales]: https://uploadcare.com/docs/uploads/widget/locales/?utm_source=github&utm_campaign=uploadcare-widget
[uc-docs-widget-v2]: https://uploadcare.com/documentation/widget/v2/?utm_source=github&utm_campaign=uploadcare-widget
[uc-guides-advanced]: https://uploadcare.com/docs/guides/advanced/?utm_source=github&utm_campaign=uploadcare-widget
