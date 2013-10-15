{
  namespace,
  jQuery: $,
  templates: {tpl},
  locale: {t}
} = uploadcare

namespace 'uploadcare.widget.tabs', (ns) ->

  class ns.BaseSourceTab

    CLASS_PREFIX = 'uploadcare-dialog-source-base-'
    ROLE_PREFIX = '@' + CLASS_PREFIX

    constructor: (@container, @tabButton, @dialogApi, @settings) ->

      @container.append tpl 'source-tab-base'

      @wrap = @container.find ROLE_PREFIX + 'wrap'

      notDisabled = ':not(.uploadcare-disabled-el)'
      @container.on('click', ROLE_PREFIX + 'show-files' + notDisabled, =>
        @dialogApi.switchTab 'preview')
      @container.on('click', ROLE_PREFIX + 'done' + notDisabled, @dialogApi.done)

      updateFooter = =>
        files = @dialogApi.fileColl.length()
        tooManyFiles = @settings.multipleMax and files > @settings.multipleMax
        tooFewFiles = files is 0

        @container.find(ROLE_PREFIX + 'done')
          .toggleClass 'uploadcare-disabled-el', tooManyFiles or tooFewFiles

        @container.find(ROLE_PREFIX + 'show-files')
          .toggleClass 'uploadcare-disabled-el', tooFewFiles

        @container.find(ROLE_PREFIX + 'footer-text')
          .toggleClass('uploadcare-error', tooManyFiles)
          .text(
            if tooManyFiles
              t('dialog.tabs.preview.multiple.tooManyFiles')
                .replace('%max%', @settings.multipleMax)
            else
              t('dialog.tabs.preview.multiple.title') + ' ' + t('file', files)
          )

      updateFooter()
      @dialogApi.fileColl.onAdd.add updateFooter
      @dialogApi.fileColl.onRemove.add updateFooter
