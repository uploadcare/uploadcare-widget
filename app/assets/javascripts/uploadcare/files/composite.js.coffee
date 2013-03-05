uploadcare.whenReady ->
  {
    namespace,
    jQuery: $,
    utils,
    debug
  } = uploadcare

  namespace 'uploadcare.files', (ns) ->
    class ns.CompositeFile extends ns.BaseFile
      constructor: (settings, @__files) ->
        super

        # Meaning of file fields for file group:
        #
        # @fileId           Group ID (uuid~size)
        # @fileName         null
        # @fileSize         Cumulative size
        # @isStored         If all files are stored
        # @cdnUrl           Group CDN URL
        # @cdnUrlModifiers  Group CDN URL modifiers
        # @previewUrl       null
        # @isImage          If group has any images (and can be previewed)
        #
        #
        # Files are uploaded separately.
        # Deferreds are composed of group item promises.
        # Progress notifications are composed of individual ones
        #
        # BaseFile needs to be array-like (see: jQuery),
        # or provide length and iteration (over one file in non-group cases).
