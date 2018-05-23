# Uploadcare Widget

<a href="https://uploadcare.com/?utm_source=github&utm_campaign=uploadcare-widget-v2">
    <img align="right" width="64" height="64"
         src="https://ucarecdn.com/2f4864b7-ed0e-4411-965b-8148623aa680/uploadcare-logo-mark.svg"
         alt="">
</a>

Uploadcare Widget is an HTML5 file uploader, a part of the [Uploadcare][uc-home]
ecosystem that fully covers your file handling.

---

**Note: there currently is a new major version of the widget.**
**Check out the stuff under the [master branch][github-branch-master].**

**[Here’s how][uc-docs-widget-migration-v2-v3] you migrate from v2 to v3.**

---

Uploads affect your web or mobile app performance. The widget ensures all of your
uploads are fast and hit their target.

[![NPM version][badge-npm-img]][badge-npm-url]
[![Build Status][badge-travis-img]][badge-travis-url]
[![Uploadcare stack on StackShare][badge-stack-img]][badge-stack-url]

It’s provided as a typical JavaScript library and can be easily embedded in your
site.

The widget is highly customizable to fit your needs. It supports multi-file
uploads, manual crop, and integrates with social media and cloud storage
providers.

## Docs

See the complete widget docs [here][uc-docs-widget].

### Quick references

* [JavaScript API][uc-docs-widget-js-api]
* [Live widget config][uc-widget-configurator]
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
npm install uploadcare-widget@2 --save
```

```javascript
import uploadcare from 'uploadcare-widget'
```

### CDN

Embed our client library via the `<script>` tag in the `<head>`
section of each page where you’d like to use Uploadcare Widget.
Here is the CDN link to the current widget version with built-in jQuery,

```html
<script src="https://ucarecdn.com/libs/widget/2.x/uploadcare.full.min.js" charset="utf-8"></script>
```

Or, if you’re already using jQuery on your page, consider loading
the light version of the widget: without built-in jQuery,

```html
<script src="https://code.jquery.com/jquery-2.2.4.min.js" charset="utf-8"></script>
<script src="https://ucarecdn.com/libs/widget/2.x/uploadcare.min.js" charset="utf-8"></script>
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
[badge-travis-img]: https://api.travis-ci.org/uploadcare/uploadcare-widget.svg?branch=v2
[badge-travis-url]: https://travis-ci.org/uploadcare/uploadcare-widget
[badge-stack-img]: https://img.shields.io/badge/tech-stack-0690fa.svg?style=flat
[badge-stack-url]: https://stackshare.io/uploadcare/stacks/
[github-branch-master]: https://github.com/uploadcare/uploadcare-widget
[github-files-development]: https://github.com/uploadcare/uploadcare-widget/blob/v2/DEVELOPMENT.md
[uc-email-bounty]: mailto:bugbounty@uploadcare.com
[uc-email-hello]: mailto:hello@uploadcare.com
[uc-home]: https://uploadcare.com/?utm_source=github&utm_campaign=uploadcare-widget-v2
[uc-widget-configurator]: https://uploadcare.com/widget/configure/2.x/?utm_source=github&utm_campaign=uploadcare-widget-v2
[uc-docs-libs]: https://uploadcare.com/docs/libs/?utm_source=github&utm_campaign=uploadcare-widget-v2
[uc-docs-widget]: https://uploadcare.com/documentation/widget/v2/?utm_source=github&utm_campaign=uploadcare-widget-v2
[uc-docs-widget-js-api]: https://uploadcare.com/documentation/javascript_api/v2/?utm_source=github&utm_campaign=uploadcare-widget-v2
[uc-docs-widget-visual-tweaks]: https://uploadcare.com/cookbook/widget_visual/v2/?utm_source=github&utm_campaign=uploadcare-widget-v2
[uc-docs-widget-validation]: https://uploadcare.com/cookbook/validation/v2/?utm_source=github&utm_campaign=uploadcare-widget-v2
[uc-docs-widget-styling]: https://uploadcare.com/documentation/widget/v2/?utm_source=github&utm_campaign=uploadcare-widget-v2#styling
[uc-docs-widget-migration-v2-v3]: https://uploadcare.com/docs/uploads/widget/migration_v2_v3/?utm_source=github&utm_campaign=uploadcare-widget-v2
[uc-docs-widget-install]: https://uploadcare.com/documentation/widget/v2/?utm_source=github&utm_campaign=uploadcare-widget-v2#install
[uc-docs-widget-options-public-key]: https://uploadcare.com/documentation/widget/v2/?utm_source=github&utm_campaign=uploadcare-widget-v2#option-public-key
[uc-docs-widget-config]: https://uploadcare.com/documentation/widget/v2/?utm_source=github&utm_campaign=uploadcare-widget-v2#configuration
[uc-docs-widget-v2]: https://uploadcare.com/documentation/widget/v2/?utm_source=github&utm_campaign=uploadcare-widget-v2
[uc-guides-advanced]: https://uploadcare.com/cookbook/advanced/v2/?utm_source=github&utm_campaign=uploadcare-widget-v2