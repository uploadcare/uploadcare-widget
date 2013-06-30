{
  namespace,
  jQuery: $,
  templates: {tpl},
  locale: {t},
  MULTIPLE_UPLOAD_FILES_LIMIT
} = uploadcare

namespace 'uploadcare.widget.tabs', (ns) ->

  class ns.BaseSourceTab

    CLASS_PREFIX = 'uploadcare-dialog-source-base-'
    ROLE_PREFIX = '@' + CLASS_PREFIX

    constructor: (@container, @tabButton, @dialogApi, @settings) ->

      @container.append tpl 'source-tab-base'

      @wrap = @container.find ROLE_PREFIX + 'wrap'

      notDisabled = ':not(.uploadcare-disabled-el)'

      if not uploadcare.settings.common().customWidget
      
        @container.on('click', ROLE_PREFIX + 'show-files' + notDisabled, @dialogApi.switchToPreview)
        @container.on('click', ROLE_PREFIX + 'done' + notDisabled, @dialogApi.done)

        updateFooter = =>
          toManyFiles = @dialogApi.fileColl.length() > MULTIPLE_UPLOAD_FILES_LIMIT
          toLessFiles = @dialogApi.fileColl.length() is 0

          @container.find(ROLE_PREFIX + 'done')
            .toggleClass 'uploadcare-disabled-el', toManyFiles or toLessFiles

          @container.find(ROLE_PREFIX + 'show-files')
            .toggleClass 'uploadcare-disabled-el', toLessFiles

          @container.find(ROLE_PREFIX + 'footer-text')
            .toggleClass('uploadcare-error', toManyFiles)
            .text(
              if toManyFiles
                t('dialog.tabs.preview.multiple.toManyFiles')
                  .replace('%max%', MULTIPLE_UPLOAD_FILES_LIMIT)
              else
                t('dialog.tabs.preview.multiple.title') + ' ' + t('file', @dialogApi.fileColl.length())
            )

        updateFooter()
        @dialogApi.fileColl.onAdd.add updateFooter
        @dialogApi.fileColl.onRemove.add updateFooter
