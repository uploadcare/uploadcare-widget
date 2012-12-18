# Embedding Uploadcare Web Widgets

## As an Input

1. Add this to the `<head>` section of your page:

        <script>UPLOADCARE_PUBLIC_KEY='your_public_key';</script>  <!-- TODO: meta tag? -->
        <script async src="https://ucarecdn.com/widget/0.4.7/uploadcare/uploadcare-0.4.7.min.js"></script>

2. Then, anywhere on the page:

        <input type="hidden" role="uploadcare-uploader" name="some_name" />
        <!-- TODO: allow placeholder with fixed width/height to avoid 'jumping' -->

> TODO: Document styling

## As a dialog-opening button

> TODO

