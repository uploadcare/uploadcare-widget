# History

### 0.13.4, 05.10.2013

* Fixed loading from url and social sources. Bug introduced in 0.13.3.

### 0.13.3, 03.10.2013

* Opening speed is significantly impoved for widget with hundreds of files
* Restored compatibility with IE8 and some Firefox versions

### 0.13.2, 30.09.2013

* Translations fixes

### 0.13.1, 26.09.2013

* widget size reduced from 341 to 293 kb (from 104 to 93 kb gziped)

### 0.13.0, 26.09.2013

* Widget no longer accepts urls in `value` HTML-attribute or `value()` method.
  You should use `widget.value(uploadcare.fileFrom('url', 'http://url/'))`.
* Widget now can be used with any custom domain.

### 0.12.5, 23.09.2013

* switch to preview tab right after selecting files
* prevent to request not ready images in multiupload preview

### 0.12.4, 16.09.2013

* `uploadcare.tabsCss` api fixed

### 0.12.3, 13.09.2013

* restrictions on the number of files in multiupload group removed

### 0.12.2, 12.09.2013

* fixed bug introduced in 0.12.0 related to loading info about already uploaded files

### 0.12.1, 12.09.2013

* crop options "upscale" and "minimum" also applicable to ratio
* built-in jQuery (version 1.8.3) now available in `uploadcare.jQuery`

### 0.12.0, 28.08.2013

* new property `originalImageInfo` of `fileInfo` object
* now you can use `fileInfo.cdnUrl` with all operations right after uploading
* traffic and preview delay significantly reduced for large images
* new option for crop — "minimum". Doesn't allows user to select area less
  then you specified

### 0.11.2, 13.08.2013

* add Chinese (Simplified) locale

### 0.11.1, 06.08.2013

* [drag and drop api](https://uploadcare.com/documentation/javascript_api/#drag-and-drop)
* [source tabs styling](https://uploadcare.com/documentation/javascript_api/#sources-style)
* widget size reduced from 455 to 346 kb (from 144 to 105 kb gziped)
* fixed bug when can't upload new file from uploadcare cdn url
* better compatibility with host page markup

### 0.10.1, 11.07.2013

* evernote is supported as a source of files
* if images_only is used, video thumbnails are loaded from the instagram
* fixed bug, preventing some of our clients from using uploadcare with AMD
