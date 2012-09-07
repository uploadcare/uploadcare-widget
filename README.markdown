This is widget for [Uploadcare service](http://uploadcare.com). The code let you generate new version or js code. It also can be used as an ordinary rails plugin.

## A rails plugin

Add `uploadcare-widget` to your Gemfile in `assets` section and add this line to your javascript:
    
    // = require uploadcare/widget

See other instructions in [official Uploadcare documentation](http://uploadcare.com/documentation).

## Build new version

Clone the repository, make your changes, update VERSION [here](https://github.com/uploadcare/uploadcare-widget/blob/master/lib/uploadcare-widget/version.rb) and make release:
    
    rake release
    rake make_js_build AWS_ACCESS_KEY_ID=key AWS_SECRET_ACCESS_KEY=secret AWS_BUCKET_NAME=bucket

Last line makes compiled javascript file in `pkg` folder and upload it in AWS S3.
